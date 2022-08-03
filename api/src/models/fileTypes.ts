import { dbQuery } from './db';

export const dbGetFiletypes = async () => {
  let sqlQuery = `SELECT * FROM file_types ORDER BY id;`;
  const books = await dbQuery(sqlQuery);
  return books.rows;
};

export const dbGetFileType = async (fileTypeId: number) => {
  let sqlQuery = `SELECT name FROM file_types WHERE id = $1;`;
  const values = [fileTypeId];
  const fileType = await dbQuery(sqlQuery, values);
  return fileType.rows[0].name;
};
