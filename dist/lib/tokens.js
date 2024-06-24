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
exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokens_1 = require("../db/tokens");
const express_error_1 = require("./express-error");
function generateAccessToken(user) {
    const authKey = process.env.AUTH_KEY;
    if (!authKey)
        throw new express_error_1.ExpressError(500, "Secret key is missing!");
    return jsonwebtoken_1.default.sign(user, authKey, { expiresIn: "15m" });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(user) {
    const refreshKey = process.env.REFRESH_KEY;
    if (!refreshKey)
        throw new express_error_1.ExpressError(500, "Secret key is missing!");
    return jsonwebtoken_1.default.sign(user, refreshKey, { expiresIn: "1d" });
}
exports.generateRefreshToken = generateRefreshToken;
function generateTokens(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        yield (0, tokens_1.saveRefreshToken)(user.id, refreshToken);
        return { accessToken, refreshToken };
    });
}
exports.generateTokens = generateTokens;
