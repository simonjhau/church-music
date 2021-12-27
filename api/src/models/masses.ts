import { dbBegin, dbQuery } from './db';

export const getAllMasses = async () => {
  let sqlQuery = `SELECT 
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

export const getMassesQueryName = async (query: string) => {
  let sqlQuery = `SELECT 
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

export const getMassHymns = async (query: string) => {
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

  let params = [query];
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
  massId: string;
  massName: string;
  massDateTime: Date;
  hymns: HymnInterface[];
}

export const addMass = async (massParams: MassParamsInterface) => {
  const { massId, massName, massDateTime } = massParams;
  let sqlQuery = `INSERT INTO masses (id, name, date_time) 
                  VALUES ($1, $2, $3)
                  RETURNING *`;
  let values = [massId, massName, massDateTime];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};

export const addMassHymns = async (massParams: MassParamsInterface) => {
  const promises: Promise<any>[] = [];

  massParams.hymns.forEach((hymn, hymnIndex) => {
    let sqlQuery = `INSERT INTO mass_hymns 
                    (mass_id, hymn_pos, hymn_type_id, hymn_id, file_ids) 
                    VALUES ($1, $2, $3, $4, $5)`;
    let values = [
      massParams.massId,
      hymnIndex,
      hymn.hymnTypeId,
      hymn.id,
      hymn.fileIds,
    ];

    promises.push(dbQuery(sqlQuery, values));
  });

  await Promise.all(promises);
};

export const dbAddMassFileInfo = async (massFileId: string, massId: string) => {
  await dbBegin();
  const sqlQuery = `UPDATE masses SET file_id = $1 WHERE id = $2`;
  const values = [massFileId, massId];
  const file = await dbQuery(sqlQuery, values);
  return file.rows;
};
