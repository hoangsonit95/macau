const mysql = require('mysql2/promise');
import * as dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: 'root',
  // user: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASS,
  password: null,
  database: process.env.DATABASE_NAME,
});

export default connection;
