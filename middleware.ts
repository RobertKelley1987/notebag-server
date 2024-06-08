import { RequestHandler } from "express";
import { ExpressError } from "./util/express-error";

export const auth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    throw new ExpressError(401, "User is not authorized to access this route.");
  }

  return next();
};
