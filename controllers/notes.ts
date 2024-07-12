import {
  createNote,
  deleteNote,
  getNoteById,
  getUserNotes,
  updateNote,
  updateNoteIsPinned,
} from "../db/notes";
import { getNoteTags } from "../db/tags";
import {
  createNoteTag,
  findNoteTags,
  deleteNoteTag,
  deleteAllNoteTags,
} from "../db/notetags";
import { ExpressError } from "../lib/express-error";
import type { Request, Response } from "express";
import type { Tag } from "../types";

const notes = {
  create: async (req: Request, res: Response) => {
    const { id, title, content, pinned = false, tags } = req.body;
    if (!id) {
      throw new ExpressError(400, "Note id is required.");
    }

    if (!title && !content) {
      throw new ExpressError(
        400,
        "Both title and content of this note are empty."
      );
    }

    // Create new note
    const userId = req.user.id;
    const newNote = await createNote(id, userId, title, content, pinned);

    // Add tags to note
    if (tags.length > 0) {
      const tagPromises = tags.map((tag: Tag) =>
        createNoteTag(newNote.id, tag.id)
      );
      await Promise.all(tagPromises);
    }

    res.status(201).send({ note: newNote });
  },
  update: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { title, content, pinned = false, tags } = req.body;
    if (!noteId) {
      throw new ExpressError(400, "Note id is required to update note.");
    }

    // Remove previous note tags and add provided tags
    await deleteAllNoteTags(noteId);
    if (tags.length > 0) {
      const tagPromises = tags.map((tag: Tag) => createNoteTag(noteId, tag.id));
      await Promise.all(tagPromises);
    }

    const updatedNote = await updateNote(noteId, title, content, pinned);
    res.status(200).send({ note: updatedNote });
  },
  updatePinned: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { pinned } = req.body;
    if (!noteId) {
      throw new ExpressError(400, "Note id is required to update note.");
    }

    const updatedNote = await updateNoteIsPinned(noteId, pinned);
    res.status(200).send({ note: updatedNote });
  },
  updateTags: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { tagId } = req.body;

    const noteTags = await findNoteTags(noteId);
    const tagIndex = noteTags.findIndex((tag) => tag.tagId === tagId);
    if (tagIndex === -1) {
      await createNoteTag(noteId, tagId);
    } else {
      await deleteNoteTag(noteId, tagId);
    }

    res.status(200).send({ noteId, tagId });
  },
  findAll: async (req: Request, res: Response) => {
    const userId = req.user.id;
    // Fetch notes (title and content)
    const notes = await getUserNotes(userId);

    // Fetch tags for each note
    const tagPromises = notes.map((note) => getNoteTags(note.id));
    const noteTags = await Promise.all(tagPromises);

    // Assign tags to notes before returning to client
    for (let i = 0; i < notes.length; i++) {
      notes[i].tags = noteTags[i];
    }

    res.status(200).send({ notes });
  },
  findOne: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const note = await getNoteById(noteId);
    res.status(200).send({ note });
  },
  delete: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { id } = await deleteNote(noteId);
    res.status(200).send({ id });
  },
};

export default notes;
