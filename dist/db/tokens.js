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
exports.deleteRefreshToken = exports.saveRefreshToken = void 0;
const config_1 = __importDefault(require("./config"));
const express_error_1 = require("../lib/express-error");
function saveRefreshToken(userId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            const values = [token, userId];
            yield config_1.default.query(sql, values);
            return { success: "Refresh token saved to db." };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to save refresh token in db.");
        }
    });
}
exports.saveRefreshToken = saveRefreshToken;
function deleteRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            const values = ["", userId];
            yield config_1.default.query(sql, values);
            return { success: "Token deleted from db." };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to delete tag from db.");
        }
    });
}
exports.deleteRefreshToken = deleteRefreshToken;
