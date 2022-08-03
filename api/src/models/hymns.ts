import { dbQuery } from './db';

export const dbGetHymns = async (query: string) => {
  let sqlQuery = `SELECT 
                  id, 
                  name, 
                  lyrics        
                  FROM hymns 
                  WHERE LOWER(name) LIKE LOWER('%' || $1 || '%') 
                  OR LOWER(lyrics) LIKE LOWER('%' || $1 || '%') ;`;
  let values = [query];
  const hymns = await dbQuery(sqlQuery, values);
  return hymns.rows;
};

export const dbGetHymn = async (query: string) => {
  let sqlQuery = `SELECT 
                  id, 
                  name, 
                  lyrics        
                  FROM hymns 
                  WHERE id = $1;`;
  let values = [query];
  const hymns = await dbQuery(sqlQuery, values);
  return hymns.rows;
};

export const dbAddHymn = async (id: string, name: string) => {
  const sqlQuery = `INSERT into hymns (id, name)
                    VALUES ($1, $2);`;
  const values = [id, name];
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
  lyrics: string = ''
) => {
  const sqlQuery = `UPDATE hymns
                    SET name = $1,
                    lyrics = $2
                    WHERE id = $3;`;
  const values = [name, lyrics, hymnId];
  await dbQuery(sqlQuery, values);
};

export const dbGetHymnName = async (hymnId: string) => {
  const sqlQuery = `SELECT name FROM hymns where id = $1;`;
  const values = [hymnId];
  const hymnName = await dbQuery(sqlQuery, values);
  return hymnName.rows[0].name;
};
