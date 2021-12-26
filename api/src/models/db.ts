import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.AWS_DB_ENDPOINT,
  database: process.env.AWS_DB_NAME,
  port: parseInt(process.env.AWS_DB_PORT as string),
  user: process.env.AWS_DB_USER_NAME,
  password: process.env.AWS_DB_PASSWORD,
});

export const dbQuery = async (text: string, params?: any[]) => {
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
