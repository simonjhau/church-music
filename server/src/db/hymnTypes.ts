import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const HymnTypeSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
type HymnType = z.infer<typeof HymnTypeSchema>;

export const dbGetHymnTypes = async (): Promise<HymnType[]> => {
  const query = `SELECT id, name
                   FROM hymn_types
                   ORDER BY id;`;
  const res = (await dbPool.query(query)).rows;
  return parseData(
    z.array(HymnTypeSchema),
    res,
    "Error getting hymn types from db",
  );
};
