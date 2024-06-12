import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../util/express-error";
import type { QueryError, RowDataPacket } from "mysql2";

interface DBUser extends RowDataPacket {
  user_id: string;
  email: string;
  password: string;
}

export async function createUser(email: string, password: string) {
  try {
    const id = uuid();

    const sql = "INSERT INTO users(user_id, email, password) VALUES(?, ?, ?)";
    const values = [id, email, password];
    await db.query(sql, values);

    return { id, email, password };
  } catch (error) {
    const dbError = error as QueryError;
    if (dbError.code === "ER_DUP_ENTRY") {
      throw new ExpressError(400, "User already exists.");
    }

    throw new ExpressError(500, "Failed to register new user.");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const values = [email];
    const [res] = await db.query<DBUser[]>(sql, values);
    const user = res[0];
    return { id: user.user_id, email: user.email, password: user.password };
  } catch (error) {
    throw new ExpressError(500, "Failed to register new user.");
  }
}
