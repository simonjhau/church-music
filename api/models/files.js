import { dbBegin, dbQuery } from './db.js';

export const dbAddFile = async (fileParams) => {
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

export const getListOfFiles = async (hymnId) => {
  const sqlQuery = `SELECT * FROM files INNER JOIN hymns ON files.hymn_id = hymns.id WHERE hymn_id = $1;`;
  const values = [hymnId];
  const files = await dbQuery(sqlQuery, values);
  return files.rows;
};
