import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const HymnFileJoinHymnSchema = z
  .object({
    id: z.string(),
    hymnId: z.string(),
    hymnName: z.string(),
    fileTypeId: z.number(),
    bookId: z.number(),
    hymnNum: z.number().nullable(),
    comment: z.string(),
  })
  .strict();
type HymnFileJoinHymn = z.infer<typeof HymnFileJoinHymnSchema>;

export const dbGetListOfFiles = async (
  hymnId: string
): Promise<HymnFileJoinHymn[]> => {
  const query = `SELECT
                    hymn_files.id AS "id",
                    hymns.id AS "hymnId",
                    hymns.name AS "hymnName",
                    file_type_id AS "fileTypeId",
                    book_id AS "bookId",
                    hymn_num AS "hymnNum",
                    comment AS "comment"
                    FROM hymn_files INNER JOIN hymns ON hymn_files.hymn_id = hymns.id
                    WHERE hymn_id = $1
                    ORDER BY file_type_id;`;
  const res = (await dbPool.query(query, [hymnId])).rows;
  const hymnFiles = parseData(
    z.array(HymnFileJoinHymnSchema),
    res,
    `Error getting hymn files for "${hymnId}" from db"`
  );
  return hymnFiles;
};

export const FileParamsSchema = z
  .object({
    id: z.string(),
    hymnId: z.string(),
    hymnName: z.string().optional(),
    fileTypeId: z.number(),
    bookId: z.number(),
    hymnNum: z.number().nullable(),
    comment: z.string(),
  })
  .strict();
export type FileParams = z.infer<typeof FileParamsSchema>;

export const dbAddFile = async (file: FileParams): Promise<FileParams> => {
  const query = `INSERT INTO hymn_files
                    (hymn_id, id, file_type_id, book_id, hymn_num, comment)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING
                    hymn_id AS "hymnId",
                    id,
                    file_type_id AS "fileTypeId",
                    book_id AS "bookId",
                    hymn_num AS "hymnNum",
                    comment`;
  const values = [
    file.hymnId,
    uuidv4(),
    file.fileTypeId,
    file.bookId,
    file.hymnNum ?? null,
    file.comment,
  ];
  const res = (await dbPool.query(query, values)).rows;
  const addedFile = parseData(
    FileParamsSchema,
    res,
    `Error adding file for hymn "${file.hymnId}" to db"`
  );
  return addedFile;
};

export const dbGetFileData = async (fileId: string): Promise<FileParams> => {
  const query = `SELECT
                  id AS "id",
                  hymn_id AS "hymnId",
                  file_type_id AS "fileTypeId",
                  book_id AS "bookId",
                  hymn_num AS "hymnNum",
                  comment AS "comment"
                  FROM hymn_files
                  WHERE id = $1;`;
  const res = (await dbPool.query(query, [fileId])).rows[0];
  const fileData = parseData(
    FileParamsSchema,
    res,
    `Error getting file "${fileId}" from db"`
  );
  return fileData;
};

const FileDataNamesSchema = z.object({
  id: z.string(),
  hymnName: z.string(),
  fileType: z.string(),
  bookCode: z.string(),
  hymnNum: z.string().nullable(),
  comment: z.string(),
});
type FileDataNames = z.infer<typeof FileDataNamesSchema>;
export const dbGetFileDataNames = async (
  fileId: string
): Promise<FileDataNames> => {
  const query = `SELECT
                  hf.id AS "id",
                  h.name AS "hymnName",
                  ft.name AS "fileType",
                  b.book_code AS "bookCode",
                  hymn_num AS "hymnNum",
                  comment AS "comment"
                  FROM hymn_files hf
                  JOIN hymns h ON h.id = hf.hymn_id
                  JOIN file_types ft ON ft.id = hf.file_type_id
                  JOIN books b on b.id = hf.book_id
                  WHERE hf.id = $1;`;
  const res = (await dbPool.query(query, [fileId])).rows[0];
  const fileDataNames = parseData(
    FileDataNamesSchema,
    res,
    `Error getting file "${fileId}" joined with names from db"`
  );
  return fileDataNames;
};

export const dbUpdateFile = async (
  hymnId: string,
  fileId: string,
  fileParams: FileParams
): Promise<void> => {
  const query = `UPDATE hymn_files SET
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
  await dbPool.query(query, values);
};

export const dbDeleteFile = async (
  hymnId: string,
  fileId: string
): Promise<void> => {
  const sqlQuery = `DELETE FROM hymn_files WHERE
                    hymn_id = $1 AND id = $2;`;
  const values = [hymnId, fileId];
  await dbPool.query(sqlQuery, values);
};
