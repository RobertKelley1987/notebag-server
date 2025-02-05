import mysql from "mysql2/promise";

const port = parseInt(process.env.DB_PORT || "3306");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: port,
});

export default db;
