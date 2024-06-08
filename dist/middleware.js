"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_error_1 = require("./util/express-error");
const auth = (req, res, next) => {
    if (!req.session.userId) {
        throw new express_error_1.ExpressError(401, "User is not authorized to access this route.");
    }
    return next();
};
exports.auth = auth;
