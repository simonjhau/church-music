import { dbQuery } from './db.js';

export const getFiletypes = async () => {
  let sqlQuery = `SELECT * FROM file_types ORDER BY id;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};
