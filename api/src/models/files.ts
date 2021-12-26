import { dbBegin, dbQuery } from './db';

export interface FileParamsInterface {
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
  const sqlQuery = `INSERT INTO hymn_files (${columns}) values ($1, $2, $3, $4, $5, $6)
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
