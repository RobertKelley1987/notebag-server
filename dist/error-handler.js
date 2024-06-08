"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_error_1 = require("./util/express-error");
const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof express_error_1.ExpressError) {
        const expressError = {
            message: error.message,
            statusCode: error.statusCode,
        };
        res.send({
            error: expressError,
        });
    }
    else {
        res.send({ error: error });
    }
};
exports.errorHandler = errorHandler;
