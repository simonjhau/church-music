import {} from 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.AWS_DB_ENDPOINT,
  database: process.env.AWS_DB_NAME,
  port: process.env.AWS_DB_PORT,
  user: process.env.AWS_DB_USER_NAME,
  password: process.env.AWS_DB_PASSWORD,
});

// const sendQuery = () => {
//   pool.query('SELECT * FROM books', (err, res) => {
//     if (!err) {
//       console.log(res.rows);
//     } else {
//       console.log(err.message);
//     }
//   });
// };

// const addHymn = (name, altName) => {
//   const uuid = uuidv4();
//   pool.query(
//     `INSERT INTO hymns(id, name, alt_name) VALUES ('${uuid}', '${name}', '${altName}')`,
//     (err, res) => {
//       if (!err) {
//         console.log(res.rows);
//       } else {
//         console.log(err.message);
//       }
//     }
//   );
// };

export const getHymns = async (query) => {
  let sqlQuery = `SELECT * FROM hymns 
                  WHERE LOWER(name) LIKE LOWER('%${query}%') 
                  OR LOWER(alt_name) LIKE LOWER('%${query}%');`;
  const hymns = await pool.query(sqlQuery);
  return hymns;
};
