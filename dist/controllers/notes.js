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
const tags_1 = require("../db/tags");
const notetags_1 = require("../db/notetags");
const express_error_1 = require("../lib/express-error");
const notes = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, title, content, pinned = false, pinnedAt = "", tags, } = req.body;
        if (!id) {
            throw new express_error_1.ExpressError(400, "Note id is required.");
        }
        if (!title && !content) {
            throw new express_error_1.ExpressError(400, "Both title and content of this note are empty.");
        }
        // Create new note
        const userId = req.user.id;
        const newNote = yield (0, notes_1.createNote)(id, userId, title, content, pinned, pinnedAt);
        // Add tags to note
        if (tags.length > 0) {
            const tagPromises = tags.map((tag) => (0, notetags_1.createNoteTag)(newNote.id, tag.id));
            yield Promise.all(tagPromises);
        }
        res.status(201).send({ note: newNote });
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const { title, content, pinned = false, pinnedAt = null, tags } = req.body;
        if (!noteId) {
            throw new express_error_1.ExpressError(400, "Note id is required to update note.");
        }
        // Remove previous note tags and add provided tags
        yield (0, notetags_1.deleteAllNoteTags)(noteId);
        if (tags.length > 0) {
            const tagPromises = tags.map((tag) => (0, notetags_1.createNoteTag)(noteId, tag.id));
            yield Promise.all(tagPromises);
        }
        const updatedNote = yield (0, notes_1.updateNote)(noteId, title, content, pinned, pinnedAt);
        res.status(200).send({ note: updatedNote });
    }),
    updatePinned: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const { pinned } = req.body;
        if (!noteId) {
            throw new express_error_1.ExpressError(400, "Note id is required to update note.");
        }
        const updatedNote = yield (0, notes_1.updateNoteIsPinned)(noteId, pinned);
        res.status(200).send({ note: updatedNote });
    }),
    updateTags: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const { tagId } = req.body;
        const noteTags = yield (0, notetags_1.findNoteTags)(noteId);
        const tagIndex = noteTags.findIndex((tag) => tag.tagId === tagId);
        if (tagIndex === -1) {
            yield (0, notetags_1.createNoteTag)(noteId, tagId);
        }
        else {
            yield (0, notetags_1.deleteNoteTag)(noteId, tagId);
        }
        res.status(200).send({ noteId, tagId });
    }),
    findAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        // Fetch notes (title and content)
        const notes = yield (0, notes_1.getUserNotes)(userId);
        // Fetch tags for each note
        const tagPromises = notes.map((note) => (0, tags_1.getNoteTags)(note.id));
        const noteTags = yield Promise.all(tagPromises);
        // Assign tags to notes before returning to client
        for (let i = 0; i < notes.length; i++) {
            notes[i].tags = noteTags[i];
        }
        res.status(200).send({ notes });
    }),
    findOne: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const note = yield (0, notes_1.getNoteById)(noteId);
        res.status(200).send({ note });
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noteId } = req.params;
        const { id } = yield (0, notes_1.deleteNote)(noteId);
        res.status(200).send({ id });
    }),
};
exports.default = notes;
