import { dbQuery } from './db.js';

export const getHymns = async (query) => {
  let sqlQuery = `SELECT * FROM hymns 
                  WHERE LOWER(name) LIKE LOWER('%${query}%') 
                  OR LOWER(alt_name) LIKE LOWER('%${query}%');`;
  const hymns = await dbQuery(sqlQuery);
  return hymns.rows;
};
