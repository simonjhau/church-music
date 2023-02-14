import pg from "pg";

import { databaseUrl } from "../config/index";

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const checkDbPoolConnection = async (): Promise<void> => {
  await dbPool.query("SELECT NOW()");
};

export const dbBeginTransaction = async (): Promise<void> => {
  await dbPool.query("BEGIN");
};

export const dbCommit = async (): Promise<void> => {
  await dbPool.query("COMMIT");
};

export const dbRollback = async (): Promise<void> => {
  await dbPool.query("ROLLBACK");
};
