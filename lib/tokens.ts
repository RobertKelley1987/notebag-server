import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/tokens";
import { ExpressError } from "./express-error";
import type { User } from "../types";

export function generateAccessToken(user: User) {
  const authKey = process.env.AUTH_KEY;
  if (!authKey) throw new ExpressError(500, "Environment variables missing.");

  return jwt.sign(user, authKey, { expiresIn: "15m" });
}

export function generateRefreshToken(user: User) {
  const refreshKey = process.env.REFRESH_KEY;
  if (!refreshKey)
    throw new ExpressError(500, "Environment variables missing.");

  return jwt.sign(user, refreshKey, { expiresIn: "1d" });
}

// Function to generate new tokens at registration and login.
export async function generateTokens(user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to db every time a new one is created.
  await saveRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
}
