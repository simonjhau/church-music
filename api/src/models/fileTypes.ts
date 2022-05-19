import { dbQuery } from './db';

export const dbGetFiletypes = async () => {
  let sqlQuery = `SELECT * FROM file_types ORDER BY id;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};
