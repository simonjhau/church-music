import pg from "pg";

import { databaseUrl } from "../config/index";

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});
