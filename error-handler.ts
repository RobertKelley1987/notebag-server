import { ErrorRequestHandler } from "express";
import { ExpressError } from "./util/express-error";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);

  if (error instanceof ExpressError) {
    const expressError = {
      message: error.message,
      statusCode: error.statusCode,
    };
    res.send({
      error: expressError,
    });
  } else {
    res.send({ error });
  }
};
