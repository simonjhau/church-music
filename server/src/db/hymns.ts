import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const HymnSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    lyrics: z.string().nullable(),
  })
  .strict();
export type Hymn = z.infer<typeof HymnSchema>;

export const dbGetHymns = async (query: string): Promise<Hymn[]> => {
  const sqlQuery = `SELECT id,
                             name,
                             lyrics
                      FROM hymns
                      WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')
                         OR LOWER(lyrics) LIKE LOWER('%' || $1 || '%');`;
  const res = (await dbPool.query(sqlQuery, [query])).rows;
  return parseData(z.array(HymnSchema), res, "Error getting hymns from db");
};

export const dbGetHymnById = async (id: string): Promise<Hymn> => {
  const query = `SELECT id,
                          name,
                          lyrics
                   FROM hymns
                   WHERE id = $1;`;
  const res = (await dbPool.query(query, [id])).rows[0];
  return parseData(HymnSchema, res, `Error getting hymn "${id} from db"`);
};

export const dbAddHymn = async (name: string): Promise<Hymn> => {
  const query = `INSERT into hymns
                       (id, name)
                   VALUES ($1, $2)
                   RETURNING
                       id,
                       name,
                       lyrics;`;
  const values = [uuidv4(), name];
  const res = (await dbPool.query(query, values)).rows[0];
  return parseData(HymnSchema, res, `Error adding hymn to db"`);
};

export const dbDeleteHymn = async (hymnId: string): Promise<void> => {
  const query = `DELETE
                   from hymns
                   WHERE id = $1;`;
  await dbPool.query(query, [hymnId]);
};

export const dbUpdateHymn = async (
  id: string,
  name: string,
  lyrics?: string | null,
): Promise<Hymn> => {
  const query = `UPDATE hymns
                   SET name   = $1,
                       lyrics = $2
                   WHERE id = $3
                   RETURNING
                       id,
                       name,
                       lyrics;`;
  const values = [name, lyrics, id];
  const res = (await dbPool.query(query, values)).rows[0];
  return parseData(
    HymnSchema,
    res,
    `Error updating hymn "${name}" (${id}) in db"`,
  );
};
