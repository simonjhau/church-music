import { dbBegin, dbQuery } from './db';

export interface FileParamsInterface {
  id: string;
  hymnId: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}

export const dbAddFile = async (
  hymnId: string,
  fileParams: FileParamsInterface
) => {
  await dbBegin();
  const columns = `hymn_id, id, file_type_id, book_id, hymn_num, comment`;
  const sqlQuery = `INSERT INTO hymn_files (${columns}) values ($1, $2, $3, $4, $5, $6)
                    RETURNING ${columns}`;
  const values = [
    hymnId,
    fileParams.id,
    fileParams.fileTypeId,
    fileParams.bookId,
    fileParams.hymnNum ? fileParams.hymnNum : null,
    fileParams.comment,
  ];
  const file = await dbQuery(sqlQuery, values);
  return file.rows;
};

export const dbGetFile = async (hymnId: string, fileId: string) => {
  const sqlQuery = `SELECT
                    id AS "id", 
                    hymn_id AS "hymnId", 
                    file_type_id AS "fileTypeId", 
                    book_id AS "bookId", 
                    hymn_num AS "hymnNum", 
                    comment AS "comment"
                    FROM hymn_files 
                    WHERE hymn_id = $1 AND id = $2;`;
  const values = [hymnId, fileId];
  const file = await dbQuery(sqlQuery, values);
  return file.rows;
};

export const dbGetListOfFiles = async (hymnId: string) => {
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

export const dbUpdateFile = async (
  hymnId: string,
  fileId: string,
  fileParams: FileParamsInterface
) => {
  const sqlQuery = `UPDATE hymn_files SET
                    file_type_id = $1,
                    book_id = $2,
                    hymn_num = $3,
                    comment = $4
                    WHERE hymn_id = $5 AND id = $6;`;
  const values = [
    fileParams.fileTypeId,
    fileParams.bookId,
    fileParams.hymnNum,
    fileParams.comment,
    hymnId,
    fileId,
  ];
  await dbQuery(sqlQuery, values);
};

export const dbDeleteFile = async (hymnId: string, fileId: string) => {
  await dbBegin();
  const sqlQuery = `DELETE FROM hymn_files WHERE 
                    hymn_id = $1 AND id = $2;`;
  const values = [hymnId, fileId];
  await dbQuery(sqlQuery, values);
};
