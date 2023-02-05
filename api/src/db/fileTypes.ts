import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const FileTypeSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
type FileType = z.infer<typeof FileTypeSchema>;

export const dbGetFileTypes = async (): Promise<FileType[]> => {
  const sqlQuery = `SELECT id, name FROM file_types ORDER BY id;`;
  const res = (await dbPool.query(sqlQuery)).rows;
  const books = parseData(
    z.array(FileTypeSchema),
    res,
    "Error getting file types from db"
  );
  return books;
};

// export const dbGetBookCode = async (bookId: number) => {
//   const sqlQuery = `SELECT book_code As "bookCode" FROM books WHERE id = $1;`;
//   const values = [bookId];
//   const book = await dbQuery(sqlQuery, values);
//   return book.rows[0].bookCode;
// };
