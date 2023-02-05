import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const HymnFileSchema = z
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
type HymnFile = z.infer<typeof HymnFileSchema>;

export const dbGetListOfFiles = async (hymnId: string): Promise<HymnFile[]> => {
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
    z.array(HymnFileSchema),
    res,
    `Error getting hymn files for "${hymnId}" from db"`
  );
  return hymnFiles;
};
