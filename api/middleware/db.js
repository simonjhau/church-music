import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: process.env.AWS_DB_ENDPOINT,
  database: process.env.AWS_DB_NAME,
  port: process.env.AWS_DB_PORT,
  user: process.env.AWS_DB_USER_NAME,
  password: process.env.AWS_DB_PASSWORD,
});

export const dbConnect = () => {
  client.connect();
};

export const sendQuery = () => {
  client.query('SELECT * FROM books', (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.log(err.message);
    }
  });
};
