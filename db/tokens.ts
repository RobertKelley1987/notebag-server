import db from "./config";
import { ExpressError } from "../lib/express-error";
import type { DBUser } from "../types";

export async function saveRefreshToken(userId: string, token: string) {
  try {
    const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
    const values = [token, userId];
    await db.query<DBUser[]>(sql, values);
    return { success: "Refresh token saved to db." };
  } catch (error) {
    throw new ExpressError(500, "Failed to save refresh token in db.");
  }
}

export async function deleteRefreshToken(userId: string) {
  try {
    const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
    const values = ["", userId];
    await db.query(sql, values);
    return { success: "Token deleted from db." };
  } catch (error) {
    throw new ExpressError(500, "Failed remove token from user.");
  }
}
