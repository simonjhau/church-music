import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const HymnCountSchema = z.object({
  name: z.string(),
  count: z.string(),
});
type HymnCount = z.infer<typeof HymnCountSchema>;
export const dbGetMostPopularHymns = async (): Promise<HymnCount[]> => {
  const query = `SELECT h.name as "name", count(*) as count
                  FROM mass_hymns mh
                  JOIN hymns h ON mh.hymn_id = h.id
                  JOIN masses m ON mh.mass_id = m.id
                  WHERE m.date_time > now() - interval '1 year'
                  GROUP BY h.name ORDER BY count DESC;`;
  const res = (await dbPool.query(query)).rows;
  const hymnCounts = parseData(
    z.array(HymnCountSchema),
    res,
    `Error getting hymn counts from db"`
  );
  return hymnCounts;
};
