import { ExpressError } from "./lib/express-error";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);

  if (error instanceof ExpressError) {
    res.status(error.statusCode).send({ error });
  } else {
    res.send({ error });
  }
};
