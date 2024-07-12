"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_error_1 = require("./lib/express-error");
const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof express_error_1.ExpressError) {
        res.status(error.statusCode).send({ error });
    }
    else {
        res.send({ error });
    }
};
exports.errorHandler = errorHandler;
