import { dbQuery } from './db.js';

export const getMasses = async (query) => {
  let sqlQuery = `SELECT 
                  id AS "id", 
                  name AS "name", 
                  date_time AS "dateTime"
                  FROM masses 
                  WHERE LOWER(name) LIKE LOWER('%' || $1 || '%');`;
  let values = [query];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};

export const getMassHymns = async (query) => {
  const sqlQuery = `SELECT 
                  hymn_pos AS "hymnPos",
                  hymn_type_id AS "hymnTypeId",
                  hymn_id AS "id",
                  hymn.name AS "name",
                  file_Ids AS "fileIds"
                  FROM mass_hymns 
                  INNER JOIN hymns hymn ON mass_hymns.hymn_id = hymn.id 
                  WHERE mass_id = $1
                  ORDER BY hymn_pos;`;

  let values = [query];
  const mass = await dbQuery(sqlQuery, values);
  return mass.rows;
};

export const addMass = async (massParams) => {
  const { massId, massName, massDateTime } = massParams;
  let sqlQuery = `INSERT INTO masses (id, name, date_time) 
                  VALUES ($1, $2, $3)
                  RETURNING *`;
  let values = [massId, massName, massDateTime];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};

export const addMassHymns = async (massParams) => {
  for (const [hymnIndex, hymn] of massParams.hymns.entries()) {
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
    await dbQuery(sqlQuery, values);
  }
};
