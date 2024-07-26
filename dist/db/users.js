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
exports.getUserByToken = exports.getUserByEmail = exports.createUser = void 0;
const config_1 = __importDefault(require("./config"));
const uuid_1 = require("uuid");
const express_error_1 = require("../lib/express-error");
function createUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = (0, uuid_1.v4)();
            const sql = "INSERT INTO users(user_id, email, password) VALUES(?, ?, ?)";
            const values = [id, email, password];
            yield config_1.default.query(sql, values);
            return { id, email, password };
        }
        catch (error) {
            console.log(error);
            // Notify client if user already exists.
            const dbError = error;
            if (dbError.code === "ER_DUP_ENTRY") {
                throw new express_error_1.ExpressError(400, "User already exists.");
            }
            // Otherwise send more generic error message.
            throw new express_error_1.ExpressError(500, "Failed to register new user.");
        }
    });
}
exports.createUser = createUser;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT user_id AS id, email, password FROM users WHERE email = ?";
            const values = [email];
            const [res] = yield config_1.default.query(sql, values);
            return res[0];
        }
        catch (error) {
            throw new express_error_1.ExpressError(404, "User not found.");
        }
    });
}
exports.getUserByEmail = getUserByEmail;
function getUserByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT user_id AS id, email, password FROM users WHERE refresh_token = ?";
            const values = [token];
            const [res] = yield config_1.default.query(sql, values);
            return res[0];
        }
        catch (error) {
            throw new express_error_1.ExpressError(404, "User not found.");
        }
    });
}
exports.getUserByToken = getUserByToken;
