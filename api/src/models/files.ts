import { dbBegin, dbQuery } from './db';

interface FileParamsInterface {
  id: string;
  hymnId: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}

export const dbAddFile = async (fileParams: FileParamsInterface) => {
  await dbBegin();
  const columns = `id, hymn_id, file_type_id, book_id, hymn_num, comment`;
  const sqlQuery = `INSERT INTO files (${columns}) values ($1, $2, $3, $4, $5, $6)
                    RETURNING ${columns}`;
  const values = [
    fileParams.id,
    fileParams.hymnId,
    fileParams.fileTypeId,
    fileParams.bookId,
    fileParams.hymnNum ? fileParams.hymnNum : null,
    fileParams.comment,
  ];
  const file = await dbQuery(sqlQuery, values);
  return file.rows;
};

export const getListOfFiles = async (hymnId: string) => {
  const sqlQuery = `SELECT 
                    files.id AS "id", 
                    hymns.id AS "hymnId",
                    hymns.name AS "hymnName",
                    hymns.alt_name AS "altName",
                    file_type_id AS "fileTypeId", 
                    book_id AS "bookId", 
                    hymn_num AS "hymnNum", 
                    comment AS "comment"
                    FROM files INNER JOIN hymns ON files.hymn_id = hymns.id 
                    WHERE hymn_id = $1
                    ORDER BY file_type_id;`;
  const values = [hymnId];
  const files = await dbQuery(sqlQuery, values);
  return files.rows;
};
