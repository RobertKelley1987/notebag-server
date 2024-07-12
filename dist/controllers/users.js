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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_error_1 = require("../lib/express-error");
const users_1 = require("../db/users");
const tokens_1 = require("../lib/tokens");
const tokens_2 = require("../db/tokens");
const COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
};
const users = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new express_error_1.ExpressError(400, "Email and password are both required.");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = yield (0, users_1.createUser)(email, hashedPassword);
        const { accessToken, refreshToken } = yield (0, tokens_1.generateTokens)({
            id: newUser.id,
        });
        res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
        res.status(201).json({ accessToken });
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new express_error_1.ExpressError(400, "Email and password are both required.");
        }
        const foundUser = yield (0, users_1.getUserByEmail)(email);
        if (!foundUser)
            throw new express_error_1.ExpressError(400, "Invalid credentials.");
        const passwordValidated = yield bcryptjs_1.default.compare(password, foundUser.password);
        if (passwordValidated) {
            const { accessToken, refreshToken } = yield (0, tokens_1.generateTokens)({
                id: foundUser.id,
            });
            res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
            return res.status(201).json({ accessToken });
        }
        throw new express_error_1.ExpressError(400, "Invalid credentials.");
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cookies = req.cookies;
        if (!cookies) {
            return res.status(204).send({ message: "User is not logged in. " });
        }
        const refreshToken = cookies.jwt;
        // If user with token is not found, clear cookies and return response.
        const foundUser = yield (0, users_1.getUserByToken)(refreshToken);
        if (!foundUser) {
            res.clearCookie("jwt", COOKIE_OPTIONS);
            return res.status(200).send({ success: "User is logged out. " });
        }
        // Delete refresh token from user, clear cookie and return response.
        yield (0, tokens_2.deleteRefreshToken)(foundUser.id);
        res.clearCookie("jwt", COOKIE_OPTIONS);
        return res.status(200).send({ success: "User is logged out." });
    }),
};
exports.default = users;
