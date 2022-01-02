import { dbQuery } from './db';

export const dbGetHymns = async (query: string) => {
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

export const dbGetHymn = async (query: string) => {
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

export const dbAddHymn = async (
  id: string,
  name: string,
  altName: string = ''
) => {
  const sqlQuery = `INSERT into hymns (id, name, alt_name)
                    VALUES ($1, $2, $3);`;
  const values = [id, name, altName];
  await dbQuery(sqlQuery, values);
};

export const dbDeleteHymn = async (hymnId: string) => {
  const sqlQuery = `DELETE from hymns
                    WHERE id = $1;`;
  const values = [hymnId];
  await dbQuery(sqlQuery, values);
};

export const dbUpdateHymn = async (
  hymnId: string,
  name: string,
  altName: string = '',
  lyrics: string = ''
) => {
  const sqlQuery = `UPDATE hymns
                    SET name = $1,
                    alt_name = $2,
                    lyrics = $3
                    WHERE id = $4;`;
  const values = [name, altName, lyrics, hymnId];
  await dbQuery(sqlQuery, values);
};
