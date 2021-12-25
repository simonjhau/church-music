import { dbQuery } from './db';

export const getBooks = async () => {
  let sqlQuery = `SELECT * FROM books;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};
