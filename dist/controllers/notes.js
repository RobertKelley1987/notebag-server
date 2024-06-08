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
Object.defineProperty(exports, "__esModule", { value: true });
const notes_1 = require("../db/notes");
const express_error_1 = require("../util/express-error");
const notes = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId, title, content } = req.body;
        if (!noteId) {
            throw new express_error_1.ExpressError(400, "Note id is required.");
        }
        if (!title && !content) {
            throw new express_error_1.ExpressError(400, "Both title and content of this note are empty.");
        }
        const userId = req.session.userId;
        const newNote = yield (0, notes_1.createNote)(noteId, userId, title, content);
        res.status(200).send({ note: newNote });
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const { title, content } = req.body;
        if (!noteId) {
            throw new express_error_1.ExpressError(400, "Note id is required to update note.");
        }
        const updatedNote = yield (0, notes_1.updateNote)(noteId, title, content);
        res.status(200).send({ note: updatedNote });
    }),
    findAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.session.userId;
        const notes = yield (0, notes_1.getUserNotes)(userId);
        res.status(200).send({ notes });
    }),
};
exports.default = notes;
