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

export const getFileId = async (fileParams) => {
  const sqlQuery = `SELECT * FROM files WHERE 
                    hymn_id = '${fileParams.hymnId}' AND
                    file_type_id = '${fileParams.file_type_id}' AND
                    book_id = '${fileParams.book_id}'`;
  if (fileParams.book_id) {
    sqlQuery += `AND book_num = '${fileParams.book_num}'`;
  }
  if (fileParams.comment) {
    sqlQuery += `comment = '${fileParams.comment}'`;
  }
  sqlQuery += `;`;
  console.log(sqlQuery);
  const file = await dbQuery(sqlQuery);
  return file.row;
};
