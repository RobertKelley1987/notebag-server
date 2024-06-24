"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_error_1 = require("./lib/express-error");
const authorizeToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeaders = req.headers["authorization"];
    console.log(req.headers);
    if (!authHeaders)
        throw new express_error_1.ExpressError(401, "User not authorized.");
    const token = authHeaders === null || authHeaders === void 0 ? void 0 : authHeaders.split(" ")[1];
    if (!token)
        throw new express_error_1.ExpressError(401, "User not authorized.");
    const key = process.env.AUTH_KEY;
    if (!key)
        throw new express_error_1.ExpressError(500, "Secret key is missing!");
    jsonwebtoken_1.default.verify(token, key, (err, payload) => {
        if (err)
            throw new express_error_1.ExpressError(403, "User not authorized.");
        const user = payload; // Cast User type to payload
        req.user = { id: user.id };
        next();
    });
});
exports.authorizeToken = authorizeToken;
