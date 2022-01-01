import { dbQuery } from './db';

export const getBooks = async () => {
  let sqlQuery = `SELECT 
                  id AS "id",
                  name AS "name",
                  book_code AS "bookCode" 
                  FROM books;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};
