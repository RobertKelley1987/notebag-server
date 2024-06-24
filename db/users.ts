import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../lib/express-error";
import type { QueryError } from "mysql2";
import type { DBUser } from "../types";

export async function createUser(email: string, password: string) {
  try {
    const id = uuid();

    const sql = "INSERT INTO users(user_id, email, password) VALUES(?, ?, ?)";
    const values = [id, email, password];
    await db.query<DBUser[]>(sql, values);

    return { id, email, password };
  } catch (error) {
    // Notify client if user already exists.
    const dbError = error as QueryError;
    if (dbError.code === "ER_DUP_ENTRY") {
      throw new ExpressError(400, "User already exists.");
    }

    // Otherwise send more generic error message.
    throw new ExpressError(500, "Failed to register new user.");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const sql =
      "SELECT user_id AS id, email, password FROM users WHERE email = ?";
    const values = [email];
    const [res] = await db.query<DBUser[]>(sql, values);
    return res[0];
  } catch (error) {
    throw new ExpressError(404, "User not found.");
  }
}

export async function getUserByToken(token: string) {
  try {
    const sql =
      "SELECT user_id AS id, email, password FROM users WHERE refresh_token = ?";
    const values = [token];
    const [res] = await db.query<DBUser[]>(sql, values);
    return res[0];
  } catch (error) {
    throw new ExpressError(404, "User not found.");
  }
}
