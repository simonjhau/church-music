import { dbQuery } from './db.js';

export const getMasses = async (query) => {
  let sqlQuery = `SELECT 
                  id, 
                  name
                  FROM masses 
                  WHERE LOWER(name) LIKE LOWER('%' || $1 || '%');`;
  let values = [query];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};

export const getMass = async (massId) => {
  let sqlQuery = `SELECT 
                  id, 
                  name
                  FROM masses 
                  WHERE LOWER(name) LIKE LOWER('%' || $1 || '%');`;
  let values = [query];
  const masses = await dbQuery(sqlQuery, values);
  return masses.rows;
};
