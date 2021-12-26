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

export const getListOfFiles = async (hymnId: string) => {
  const sqlQuery = `SELECT 
                    hymn_files.id AS "id", 
                    hymns.id AS "hymnId",
                    hymns.name AS "hymnName",
                    hymns.alt_name AS "altName",
                    file_type_id AS "fileTypeId", 
                    book_id AS "bookId", 
                    hymn_num AS "hymnNum", 
                    comment AS "comment"
                    FROM hymn_files INNER JOIN hymns ON hymn_files.hymn_id = hymns.id 
                    WHERE hymn_id = $1
                    ORDER BY file_type_id;`;
  const values = [hymnId];
  const files = await dbQuery(sqlQuery, values);
  return files.rows;
};
