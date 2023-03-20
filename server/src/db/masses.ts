import format from "pg-format";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const MassSchema = z.object({
  id: z.string(),
  name: z.string(),
  dateTime: z.date(),
  fileId: z.string().nullable(),
});
export type Mass = z.infer<typeof MassSchema>;

export const dbGetAllMasses = async (): Promise<Mass[]> => {
  const sqlQuery = `SELECT
                  id AS "id",
                  name AS "name",
                  date_time AS "dateTime",
                  file_id AS "fileId"
                  FROM masses
                  ORDER BY date_time DESC`;
  const res = (await dbPool.query(sqlQuery)).rows;
  const masses = parseData(
    z.array(MassSchema),
    res,
    `Error getting all masses from db"`
  );
  return masses;
};

export const dbGetMassesByQuery = async (query: string): Promise<Mass[]> => {
  const sqlQuery = `SELECT
                    id AS "id",
                    name AS "name",
                    date_time AS "dateTime",
                    file_id AS "fileId"
                    FROM masses
                    WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')
                    ORDER BY date_time DESC;`;
  const res = (await dbPool.query(sqlQuery, [query])).rows;
  const masses = parseData(
    z.array(MassSchema),
    res,
    `Error getting all masses from db"`
  );
  return masses;
};

export const dbGetMassData = async (massId: string): Promise<Mass> => {
  const sqlQuery = `SELECT
                    id AS "id",
                    name AS "name",
                    date_time AS "dateTime",
                    file_id AS "fileId"
                    FROM masses
                    WHERE id = $1;`;
  const res = (await dbPool.query(sqlQuery, [massId])).rows[0];
  const mass = parseData(
    MassSchema,
    res,
    `Error getting mass "${massId}" from db"`
  );
  return mass;
};

const MassHymnSchema = z.object({
  hymnIndex: z.number(),
  hymnTypeId: z.number(),
  id: z.string(),
  name: z.string(),
  fileIds: z.array(z.string()),
});
type MassHymn = z.infer<typeof MassHymnSchema>;
export const dbGetMassHymns = async (massId: string): Promise<MassHymn[]> => {
  const query = `SELECT
                    mass_hymns.hymn_pos AS "hymnIndex",
                    mass_hymns.hymn_type_id AS "hymnTypeId",
                    mass_hymns.hymn_id AS "id",
                    hymn.name AS "name",
                    mass_hymns.file_Ids AS "fileIds"
                    FROM mass_hymns
                    INNER JOIN hymns hymn ON mass_hymns.hymn_id = hymn.id
                    WHERE mass_id = $1
                    ORDER BY hymn_pos;`;
  const res = (await dbPool.query(query, [massId])).rows;
  const massHymns = parseData(
    z.array(MassHymnSchema),
    res,
    `Error getting hymns for mass "${massId}" from db"`
  );
  return massHymns;
};

export const MassParamsSchema = z.object({
  name: z.string(),
  dateTime: z.date(),
  hymns: z.array(MassHymnSchema),
});
export type MassParams = z.infer<typeof MassParamsSchema>;

export const NewMassParamsSchema = z.object({
  name: z.string(),
  dateTime: z.string().datetime(),
});
export type NewMassParams = z.infer<typeof NewMassParamsSchema>;

export const dbAddMass = async (massParams: NewMassParams): Promise<Mass> => {
  const sqlQuery = `INSERT INTO masses (id, name, date_time)
                    VALUES ($1, $2, $3)
                    RETURNING
                    id,
                    name,
                    date_time AS "dateTime",
                    file_id AS "fileId"`;
  const values = [uuidv4(), massParams.name, massParams.dateTime];
  const res = (await dbPool.query(sqlQuery, values)).rows[0];
  const mass = parseData(MassSchema, res, `Error adding new mass to db"`);
  return mass;
};

// Add mass hymns to mass_hymns table
export const dbAddMassHymns = async (
  massId: string,
  massParams: MassParams
): Promise<void> => {
  const hymns = massParams.hymns;

  const hymnsData = hymns.map((hymn, index) => {
    return format(
      "(%L, %L, %L, %L, ARRAY[%L])",
      massId,
      index,
      hymn.hymnTypeId,
      hymn.id,
      hymn.fileIds
    );
  }, "");

  const hymnsDataString = hymnsData.join(",");

  const sqlQuery = format(
    `INSERT INTO mass_hymns
    (mass_id, hymn_pos, hymn_type_id, hymn_id, file_ids)
    VALUES %s;`,
    hymnsDataString
  );

  await dbPool.query(sqlQuery);
};

// Duplicate mass in masses table
export const dbUpdateMass = async (
  massId: string,
  massParams: MassParams
): Promise<Mass> => {
  const sqlQuery = `UPDATE masses SET
                    name = $1,
                    date_time = $2
                    WHERE id = $3
                    RETURNING
                    id,
                    name,
                    date_time AS "dateTime",
                    file_id as "fileId"`;
  const values = [massParams.name, massParams.dateTime, massId];
  const res = (await dbPool.query(sqlQuery, values)).rows;
  const mass = parseData(MassSchema, res, `Error adding new mass to db"`);
  return mass;
};

export const dbAddMassFileInfo = async (
  massFileId: string,
  massId: string
): Promise<void> => {
  const query = `UPDATE masses SET file_id = $1 WHERE id = $2;`;
  const values = [massFileId, massId];
  await dbPool.query(query, values);
};

export const dbDeleteMass = async (massId: string): Promise<void> => {
  const query = `DELETE from masses
                    WHERE id = $1;`;
  await dbPool.query(query, [massId]);
};

export const dbDuplicateMass = async (oldMassId: string): Promise<Mass> => {
  const query = `INSERT INTO masses (id, name, date_time, file_id)
                    SELECT $1, CONCAT(name, ' (copy)'), date_time, ''
                    FROM masses WHERE id = $2
                    RETURNING
                    id,
                    name,
                    date_time AS "dateTime",
                    file_id AS "fileId";`;
  const values = [uuidv4(), oldMassId];
  await dbPool.query(query, values);
  const res = (await dbPool.query(query, values)).rows[0];
  const mass = parseData(MassSchema, res, `Error duplicating mass in db"`);
  return mass;
};

export const dbDuplicateMassHymns = async (
  oldMassId: string
): Promise<MassHymn[]> => {
  const sqlQuery = `INSERT INTO mass_hymns (mass_id, hymn_pos, hymn_type_id, hymn_id, file_ids)
                      SELECT $1, hymn_pos, hymn_type_id, hymn_id, file_ids
                      FROM mass_hymns WHERE mass_id = $2
                      RETURNING
                      mass_id AS "massId",
                      hymn_pos AS "hymnIndex,
                      hymn_type_id AS "hymnTypeId",
                      hymn_id AS "hymnId",
                      file_ids AS "fileIds";`;
  const values = [uuidv4(), oldMassId];
  await dbPool.query(sqlQuery, values);
  const res = (await dbPool.query(sqlQuery, values)).rows;
  const massHymns = parseData(
    z.array(MassHymnSchema),
    res,
    `Error duplicating mass hymn in db"`
  );
  return massHymns;
};

export const dbDeleteMassHymns = async (massId: string): Promise<void> => {
  const query = `DELETE from mass_hymns WHERE mass_id = $1;`;
  await dbPool.query(query, [massId]);
};
