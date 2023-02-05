import pg from "pg";

import { dbConnectionString } from "../config/index";

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: dbConnectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
