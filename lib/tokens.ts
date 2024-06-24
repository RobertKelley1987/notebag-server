import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/tokens";
import { ExpressError } from "./express-error";
import type { User } from "../types";

export function generateAccessToken(user: User) {
  const authKey = process.env.AUTH_KEY;
  if (!authKey) throw new ExpressError(500, "Secret key is missing!");

  return jwt.sign(user, authKey, { expiresIn: "15m" });
}

export function generateRefreshToken(user: User) {
  const refreshKey = process.env.REFRESH_KEY;
  if (!refreshKey) throw new ExpressError(500, "Secret key is missing!");

  return jwt.sign(user, refreshKey, { expiresIn: "1d" });
}

export async function generateTokens(user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await saveRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
}
