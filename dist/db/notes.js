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
exports.deleteNote = exports.getNoteById = exports.getUserNotes = exports.updateNoteIsPinned = exports.updateNote = exports.createNote = void 0;
const config_1 = __importDefault(require("./config"));
const express_error_1 = require("../lib/express-error");
function createNote(noteId, userId, title, content, pinned, pinnedAt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Shift position of all user notes.
            const posSql = "UPDATE notes SET position = position + 1 WHERE user_id = ?";
            const posValues = [userId];
            yield config_1.default.query(posSql, posValues);
            // Insert new note at position zero.
            const sql = "INSERT INTO notes(note_id, title, content, pinned, pinned_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
            const pinnedAtVal = pinnedAt ? new Date(pinnedAt) : null;
            const values = [noteId, title, content, pinned, pinnedAtVal, userId];
            yield config_1.default.query(sql, values);
            return { id: noteId, title, content, position: 0 };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to create new note in db.");
        }
    });
}
exports.createNote = createNote;
function updateNote(noteId, title, content, pinned, pinnedAt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "UPDATE notes SET title = ?, content = ?, pinned = ?, pinned_at = ? WHERE note_id = ?";
            const values = [title, content, pinned, new Date(pinnedAt), noteId];
            yield config_1.default.query(sql, values);
            return { id: noteId, title, content };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to update note in db.");
        }
    });
}
exports.updateNote = updateNote;
function updateNoteIsPinned(noteId, pinned) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "UPDATE notes SET pinned = ?, pinned_at = now() WHERE note_id = ?";
            const values = [pinned, noteId];
            yield config_1.default.query(sql, values);
            return { id: noteId, pinned };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to update note in db.");
        }
    });
}
exports.updateNoteIsPinned = updateNoteIsPinned;
function getUserNotes(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT note_id AS id, title, content, pinned, pinned_at AS pinnedAt, position FROM notes WHERE user_id = ? ORDER BY position ASC";
            const values = [userId];
            const [notes] = yield config_1.default.query(sql, values);
            return notes;
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to fetch notes from db.");
        }
    });
}
exports.getUserNotes = getUserNotes;
function getNoteById(noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT note_id AS id, title, content, pinned, pinned_at AS pinnedAt, position FROM notes WHERE note_id = ?";
            const values = [noteId];
            const [notes] = yield config_1.default.query(sql, values);
            return notes[0];
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to find note in db.");
        }
    });
}
exports.getNoteById = getNoteById;
function deleteNote(noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "DELETE FROM notes WHERE note_id = ?";
            const values = [noteId];
            yield config_1.default.query(sql, values);
            return { id: noteId };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to delete note from db.");
        }
    });
}
exports.deleteNote = deleteNote;
