import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../util/express-error";

export async function createUser(email: string, password: string) {
  try {
    const id = uuid();

    const sql = "INSERT INTO users(user_id, email, password) VALUES(?, ?, ?)";
    const values = [id, email, password];
    await db.query(sql, values);

    return { id, email, password };
  } catch (error) {
    throw new ExpressError(500, "Failed to register new user.");
  }
}
