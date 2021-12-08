import { dbQuery } from './db.js';

export const getHymnTypes = async () => {
  let sqlQuery = `SELECT * FROM hymn_types;`;
  const hymnTypes = await dbQuery(sqlQuery);
  return hymnTypes.rows;
};
