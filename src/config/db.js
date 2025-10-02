import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";
const dbUrl = new URL(
  isTest ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL
);

export const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1), // buang "/" di depan
  port: dbUrl.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
