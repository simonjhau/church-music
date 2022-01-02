import { dbQuery } from './db';

export const dbGetHymnTypes = async () => {
  let sqlQuery = `SELECT * FROM hymn_types ORDER BY id;`;
  const hymnTypes = await dbQuery(sqlQuery);
  return hymnTypes.rows;
};
