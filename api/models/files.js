import { dbBegin, dbQuery } from './db.js';

export const dbAddFile = async (fileParams) => {
  await dbBegin();
  const columns = `id, hymn_id, file_type_id, book_id, hymn_num, comment`;
  const sqlQuery = `INSERT INTO files (${columns}) values (
                    '${fileParams.id}', 
                    '${fileParams.hymnId}', 
                    '${fileParams.fileTypeId}',
                    '${fileParams.bookId}',
                    '${fileParams.hymnNum && fileParams.hymnNum}',
                    '${fileParams.comment && fileParams.comment}')
                    RETURNING ${columns}`;
  const file = await dbQuery(sqlQuery);
  return file.rows;
};

export const getListOfFiles = async (hymnId) => {
  const sqlQuery = `SELECT * FROM files WHERE hymn_id = '${hymnId}';`;
  const files = await dbQuery(sqlQuery);
  return files.rows;
};
