import { dbQuery } from './db';

export const getHymns = async (query: string) => {
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

export const getHymn = async (query: string) => {
  let sqlQuery = `SELECT 
                  id, 
                  name, 
                  alt_name as "altName",
                  lyrics        
                  FROM hymns 
                  WHERE id = $1;`;
  let values = [query];
  const hymns = await dbQuery(sqlQuery, values);
  return hymns.rows;
};