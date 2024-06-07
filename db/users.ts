import db from "./config";
import { v4 as uuid } from "uuid";

export async function create(email: string, password: string) {
  const id = uuid();

  const sql = "INSERT INTO users(user_id, email, password) VALUES(?, ?, ?)";
  const values = [id, email, password];
  await db.query(sql, values);

  return { id, email, password };
}
