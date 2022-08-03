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

export const dbGetBookCode = async (bookId: number) => {
  let sqlQuery = `SELECT book_code As "bookCode" FROM books WHERE id = $1;`;
  const values = [bookId];
  const book = await dbQuery(sqlQuery, values);
  return book.rows[0].bookCode;
};
