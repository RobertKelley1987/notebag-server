import jwt from "jsonwebtoken";
import { ExpressError } from "./lib/express-error";
import type { RequestHandler } from "express";
import type { User } from "./types";

export const authorizeToken: RequestHandler = async (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders) throw new ExpressError(401, "User not authorized.");

  const token = authHeaders?.split(" ")[1];
  if (!token) throw new ExpressError(401, "User not authorized.");

  const key = process.env.AUTH_KEY;
  if (!key) throw new ExpressError(500, "Secret key is missing!");

  jwt.verify(token, key, (err, payload) => {
    if (err) throw new ExpressError(403, "User not authorized.");
    const user = <User>payload;
    req.user = { id: user.id };
    next();
  });
};
