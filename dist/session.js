"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const express_error_1 = require("./util/express-error");
const expressSession = () => {
    if (!process.env.SECRET) {
        throw new express_error_1.ExpressError(500, "Secret required to configure express-session.");
    }
    return (0, express_session_1.default)({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
    });
};
exports.default = expressSession;
