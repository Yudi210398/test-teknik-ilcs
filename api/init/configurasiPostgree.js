import pkg from "pg";
import * as dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  // eslint-disable-next-line no-undef
  password: process.env.PASSPOSTGRE,
  database: "test_ilcs",
});
