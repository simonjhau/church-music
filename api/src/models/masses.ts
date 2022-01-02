import { dbQuery } from './db';

export const dbGetAllMasses = async () => {
  const sqlQuery = `SELECT 
                  id AS "id", 
                  name AS "name", 
                  date_time AS "dateTime",
                  file_id AS "fileId"
                  FROM masses
                  ORDER BY date_time DESC`;
  const params: string[] = [];
  const masses = await dbQuery(sqlQuery, params);
  return masses.rows;
};

export const dbGetMassesQueryName = async (query: string) => {
  const sqlQuery = `SELECT 
                    id AS "id", 
                    name AS "name", 
                    date_time AS "dateTime",
                    file_id AS "fileId"
                    FROM masses
                    WHERE LOWER(name) LIKE LOWER('%' || $1 || '%');`;
  const params = [query];
  const masses = await dbQuery(sqlQuery, params);
  return masses.rows;
};

export const dbGetMassData = async (massId: string) => {
  const sqlQuery = `SELECT 
                    id AS "id", 
                    name AS "name", 
                    date_time AS "dateTime",
                    file_id AS "fileId"
                    FROM masses
                    WHERE id = $1;`;
  const params = [massId];
  const masses = await dbQuery(sqlQuery, params);
  return masses.rows;
};

export const dbGetMassHymns = async (query: string) => {
  const sqlQuery = `SELECT 
                    mass_hymns.hymn_pos AS "hymnPos",
                    mass_hymns.hymn_type_id AS "hymnTypeId",
                    mass_hymns.hymn_id AS "id",
                    hymn.name AS "name",
                    mass_hymns.file_Ids AS "fileIds"
                    FROM mass_hymns 
                    INNER JOIN hymns hymn ON mass_hymns.hymn_id = hymn.id 
                    WHERE mass_id = $1
                    ORDER BY hymn_pos;`;

  const params = [query];
  const mass = await dbQuery(sqlQuery, params);
  return mass.rows;
};

export interface HymnInterface {
  id: string;
  name: string;
  hymnIndex: number;
  hymnTypeId: number;
  fileIds: string[];
}

export interface MassParamsInterface {
  name: string;
  dateTime: Date;
  hymns: HymnInterface[];
}

export const dbAddMass = async (
  massId: string,
  massParams: MassParamsInterface
) => {
  const sqlQuery = `INSERT INTO masses (id, name, date_time) 
                    VALUES ($1, $2, $3)
                    RETURNING *`;
  const values = [massId, massParams.name, massParams.dateTime];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};

export const dbAddMassHymns = async (
  massId: string,
  massParams: MassParamsInterface
) => {
  const promises: Promise<any>[] = [];
  console.log(massParams.hymns);

  massParams.hymns.forEach((hymn, hymnIndex) => {
    const sqlQuery = `INSERT INTO mass_hymns 
                      (mass_id, hymn_pos, hymn_type_id, hymn_id, file_ids) 
                      VALUES ($1, $2, $3, $4, $5)`;
    const values = [massId, hymnIndex, hymn.hymnTypeId, hymn.id, hymn.fileIds];
    promises.push(dbQuery(sqlQuery, values));
  });

  await Promise.all(promises);
};

export const dbUpdateMass = async (
  massId: string,
  massParams: MassParamsInterface
) => {
  const sqlQuery = `UPDATE masses SET 
                    name = $1,
                    date_time = $2
                    WHERE id = $3`;
  const values = [massParams.name, massParams.dateTime, massId];
  const file = await dbQuery(sqlQuery, values);
  return file.rows;
};

export const dbAddMassFileInfo = async (massFileId: string, massId: string) => {
  const sqlQuery = `UPDATE masses SET file_id = $1 WHERE id = $2;`;
  const values = [massFileId, massId];
  await dbQuery(sqlQuery, values);
};

export const dbDeleteMass = async (massId: string) => {
  const sqlQuery = `DELETE from masses
                    WHERE id = $1;`;
  const values = [massId];
  await dbQuery(sqlQuery, values);
};

export const dbDuplicateMass = async (oldMassId: string, newMassId: string) => {
  const sqlQuery = `INSERT INTO masses (id, name, date_time, file_id) 
                    SELECT $1, CONCAT(name, ' (copy)'), date_time, ''
                    FROM masses WHERE id = $2;`;
  const values = [newMassId, oldMassId];
  await dbQuery(sqlQuery, values);
};

export const dbDuplicateMassHymns = async (
  oldMassId: string,
  newMassId: string
) => {
  const sqlQuery = `INSERT INTO mass_hymns (mass_id, hymn_pos, hymn_type_id, hymn_id, file_ids) 
                      SELECT $1, hymn_pos, hymn_type_id, hymn_id, file_ids
                      FROM mass_hymns WHERE mass_id = $2;`;
  const values = [newMassId, oldMassId];
  await dbQuery(sqlQuery, values);
};

export const dbDeleteMassHymns = async (massId: string) => {
  const sqlQuery = `DELETE from mass_hymns
                    WHERE mass_id = $1;`;
  const values = [massId];
  await dbQuery(sqlQuery, values);
};

export const dbGetFileId = async (massId: string) => {
  const sqlQuery = `SELECT file_id AS "fileId" 
                    from masses
                    WHERE id = $1;`;
  const values = [massId];
  const result = await dbQuery(sqlQuery, values);
  return result.rows[0].fileId;
};
