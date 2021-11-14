import { sendQuery } from 'db.js';

export const getBooks = async () => {
  let sqlQuery = `SELECT * FROM hymns 
                  WHERE LOWER(name) LIKE LOWER('%${query}%') 
                  OR LOWER(alt_name) LIKE LOWER('%${query}%');`;
  const books = await sendQuery(sqlQuery);
  return books.rows;
};
