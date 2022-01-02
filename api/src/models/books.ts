import { dbQuery } from './db';

export const dbGetBooks = async () => {
  let sqlQuery = `SELECT 
                  id AS "id",
                  name AS "name",
                  book_code AS "bookCode" 
                  FROM books;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};
