import { createNote, getNoteById, getUserNotes, updateNote } from "../db/notes";
import { ExpressError } from "../util/express-error";
import type { Request, Response } from "express";

const notes = {
  create: async (req: Request, res: Response) => {
    const { noteId, title, content } = req.body;
    if (!noteId) {
      throw new ExpressError(400, "Note id is required.");
    }

    if (!title && !content) {
      throw new ExpressError(
        400,
        "Both title and content of this note are empty."
      );
    }

    const userId = req.session.userId as string;
    const newNote = await createNote(noteId, userId, title, content);

    res.status(200).send({ note: newNote });
  },
  update: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    if (!noteId) {
      throw new ExpressError(400, "Note id is required to update note.");
    }

    const updatedNote = await updateNote(noteId, title, content);
    res.status(200).send({ note: updatedNote });
  },
  findAll: async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const notes = await getUserNotes(userId);
    res.status(200).send({ notes });
  },
  findOne: async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const note = await getNoteById(noteId);
    res.status(200).send({ note });
  },
};

export default notes;
