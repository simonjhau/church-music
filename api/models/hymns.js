import { dbQuery } from './db.js';

export const getHymns = async (query) => {
  let sqlQuery = `SELECT 
                  id, 
                  name, 
                  alt_name as "altName",
                  lyrics        
                  FROM hymns 
                  WHERE LOWER(name) LIKE LOWER('%' || $1 || '%') 
                  OR LOWER(alt_name) LIKE LOWER('%' || $1 || '%') ;`;
  let values = [query];
  const hymns = await dbQuery(sqlQuery, values);
  return hymns.rows;
};
