import {} from 'dotenv/config';

import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.AWS_DB_ENDPOINT,
  database: process.env.AWS_DB_NAME,
  port: process.env.AWS_DB_PORT,
  user: process.env.AWS_DB_USER_NAME,
  password: process.env.AWS_DB_PASSWORD,
});

export const dbQuery = async (text, params) => {
  return await pool.query(text, params);
};

export const dbBegin = async () => {
  return await pool.query('BEGIN');
};

export const dbCommit = async () => {
  return await pool.query('COMMIT');
};

export const dbRollback = async () => {
  return await pool.query('ROLLBACK');
};
