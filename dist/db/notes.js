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
exports.getUserNotes = exports.updateNote = exports.createNote = void 0;
const config_1 = __importDefault(require("./config"));
const express_error_1 = require("../util/express-error");
const formatNote = (note) => {
    delete note.user_id;
    const { note_id, title, content } = note;
    return { id: note_id, title, content };
};
function createNote(noteId, userId, title, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "INSERT INTO notes(note_id, title, content, user_id) VALUES(?, ?, ?, ?)";
            const values = [noteId, title, content, userId];
            yield config_1.default.query(sql, values);
            return { id: noteId, title, content };
        }
        catch (error) {
            console.log(error);
            throw new express_error_1.ExpressError(500, "Failed to create new note in db.");
        }
    });
}
exports.createNote = createNote;
function updateNote(noteId, title, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "UPDATE notes SET title = ?, content = ? WHERE note_id = ?";
            const values = [title, content, noteId];
            yield config_1.default.query(sql, values);
            return { id: noteId, title, content };
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to update note in db.");
        }
    });
}
exports.updateNote = updateNote;
function getUserNotes(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "SELECT * FROM notes WHERE user_id = ?";
            const values = [userId];
            const [notes] = yield config_1.default.query(sql, values);
            return notes.map((note) => formatNote(note));
        }
        catch (error) {
            throw new express_error_1.ExpressError(500, "Failed to fetch notes from db.");
        }
    });
}
exports.getUserNotes = getUserNotes;
