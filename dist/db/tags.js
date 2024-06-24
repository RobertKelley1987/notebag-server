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
exports.deleteTag = exports.getNoteTags = exports.getUserTags = exports.createTag = void 0;
const config_1 = __importDefault(require("./config"));
const uuid_1 = require("uuid");
const express_error_1 = require("../lib/express-error");
function createTag(userId, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create new tag
            const tagId = (0, uuid_1.v4)();
            const tagSql = "INSERT INTO tags(tag_id, name) VALUES(?, ?)";
            const tagValues = [tagId, name];
            yield config_1.default.query(tagSql, tagValues);
            // Attach tag to user
            const userTagId = (0, uuid_1.v4)();
            const userTagSql = "INSERT INTO user_tags(user_tag_id, user_id, tag_id) VALUES(?, ?, ?)";
            const userTagValues = [userTagId, userId, tagId];
            yield config_1.default.query(userTagSql, userTagValues);
            // Return result
            return { id: tagId, name: name };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to create new tag in db.");
        }
    });
}
exports.createTag = createTag;
function getUserTags(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT tags.name, tags.tag_id AS id FROM user_tags RIGHT JOIN tags ON user_tags.tag_id = tags.tag_id WHERE user_id = ? ORDER BY name ASC";
            const values = [userId];
            const [rows] = yield config_1.default.query(sql, values);
            return rows;
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to fetch user tags from db.");
        }
    });
}
exports.getUserTags = getUserTags;
function getNoteTags(tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT tags.name, tags.tag_id AS id FROM note_tags RIGHT JOIN tags ON note_tags.tag_id = tags.tag_id WHERE note_id = ? ORDER BY name ASC";
            const values = [tagId];
            const [rows] = yield config_1.default.query(sql, values);
            return rows;
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to fetch note tags from db.");
        }
    });
}
exports.getNoteTags = getNoteTags;
function deleteTag(tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "DELETE FROM tags WHERE tag_id = ?";
            const values = [tagId];
            yield config_1.default.query(sql, values);
            return { id: tagId };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to delete tag from db.");
        }
    });
}
exports.deleteTag = deleteTag;
