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
exports.findNoteTags = exports.deleteAllNoteTags = exports.deleteNoteTag = exports.createNoteTag = void 0;
const config_1 = __importDefault(require("./config"));
const uuid_1 = require("uuid");
const express_error_1 = require("../lib/express-error");
function createNoteTag(noteId, tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const noteTagId = (0, uuid_1.v4)();
            const sql = "INSERT INTO note_tags(note_tag_id, note_id, tag_id) VALUES(?, ?, ?)";
            const values = [noteTagId, noteId, tagId];
            yield config_1.default.query(sql, values);
            return { noteTagId, noteId, tagId };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to add tag to note in db.");
        }
    });
}
exports.createNoteTag = createNoteTag;
function deleteNoteTag(noteId, tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?";
            const values = [noteId, tagId];
            yield config_1.default.query(sql, values);
            return { noteId, tagId };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to delete tag from note in db.");
        }
    });
}
exports.deleteNoteTag = deleteNoteTag;
function deleteAllNoteTags(noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "DELETE FROM note_tags WHERE note_id = ?";
            const values = [noteId];
            yield config_1.default.query(sql, values);
            return { noteId };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to delete tag from note in db.");
        }
    });
}
exports.deleteAllNoteTags = deleteAllNoteTags;
function findNoteTags(noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT note_tag_id AS id, note_id AS noteId, tag_id AS tagId FROM note_tags WHERE note_id = ?";
            const values = [noteId];
            const [rows] = yield config_1.default.query(sql, values);
            return rows;
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to fetch note tags from db.");
        }
    });
}
exports.findNoteTags = findNoteTags;
