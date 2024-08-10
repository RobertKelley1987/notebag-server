import jwt from "jsonwebtoken";
import { getUserByToken } from "../db/users";
import { generateAccessToken } from "../lib/tokens";
import { ExpressError } from "../lib/express-error";
import type { Request, Response } from "express";
import type { User } from "../types";

const tokens = {
  create: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt;
    // If no refresh token, throw 401 for no credentials.
    if (!refreshToken) throw new ExpressError(401, "User not authorized.");

    const foundUser = await getUserByToken(refreshToken);
    // If no user found, throw 403 for invalid credentials.
    if (!foundUser) throw new ExpressError(403, "User not authorized.");

    const key = process.env.REFRESH_KEY;
    if (!key)
      throw new ExpressError(500, "Environment variables not configured.");

    jwt.verify(refreshToken, key, {}, (err, payload) => {
      if (err) throw new ExpressError(403, "User not authorized.");

      const user = <User>payload;
      const accessToken = generateAccessToken({ id: user.id });
      return res.json({ accessToken });
    });
  },
};

export default tokens;
