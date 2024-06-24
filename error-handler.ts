import { ErrorRequestHandler } from "express";
import { ExpressError } from "./lib/express-error";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);

  if (error instanceof ExpressError) {
    res.status(error.statusCode).send({
      message: error.message,
    });
  } else {
    res.send({ error });
  }
};
