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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../db/users");
const tokens_1 = require("../lib/tokens");
const express_error_1 = require("../lib/express-error");
const tokens = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken)
            throw new express_error_1.ExpressError(401, "User not authorized.");
        const foundUser = yield (0, users_1.getUserByToken)(refreshToken);
        if (!foundUser)
            throw new express_error_1.ExpressError(403, "User not authorized.");
        const key = process.env.REFRESH_KEY;
        if (!key)
            throw new express_error_1.ExpressError(500, "Secret key is missing!");
        jsonwebtoken_1.default.verify(refreshToken, key, {}, (err, payload) => {
            if (err)
                throw new express_error_1.ExpressError(403, "User not authorized.");
            const user = payload;
            const accessToken = (0, tokens_1.generateAccessToken)({ id: user.id });
            return res.json({ accessToken });
        });
    }),
};
exports.default = tokens;
