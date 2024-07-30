import db from "./config";
import { ExpressError } from "../lib/express-error";
import type { RowDataPacket } from "mysql2";

interface DBNote extends RowDataPacket {
  note_id: string;
  user_id?: string;
  title?: string;
  content?: string;
  pinned?: boolean;
  pinnedAt: string;
  position: number;
}

export async function createNote(
  noteId: string,
  userId: string,
  title: string,
  content: string,
  pinned: boolean,
  pinnedAt: string
) {
  try {
    // Shift position of all user notes.
    const posSql = "UPDATE notes SET position = position + 1 WHERE user_id = ?";
    const posValues = [userId];
    await db.query<DBNote[]>(posSql, posValues);

    // Insert new note at position zero.
    const sql =
      "INSERT INTO notes(note_id, title, content, pinned, pinned_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
    const pinnedAtVal = pinnedAt ? new Date(pinnedAt) : null;
    const values = [noteId, title, content, pinned, pinnedAtVal, userId];
    await db.query<DBNote[]>(sql, values);

    return { id: noteId, title, content, position: 0 };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to create new note in db.");
  }
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string,
  pinned: boolean,
  pinnedAt: string
) {
  try {
    const sql =
      "UPDATE notes SET title = ?, content = ?, pinned = ?, pinned_at = ? WHERE note_id = ?";
    const pinnedAtVal = pinnedAt ? new Date(pinnedAt) : null;
    const values = [title, content, pinned, pinnedAtVal, noteId];
    await db.query<DBNote[]>(sql, values);

    return { id: noteId, title, content };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to update note in db.");
  }
}

export async function updateNoteIsPinned(noteId: string, pinned: boolean) {
  try {
    const sql =
      "UPDATE notes SET pinned = ?, pinned_at = now() WHERE note_id = ?";
    const values = [pinned, noteId];
    await db.query<DBNote[]>(sql, values);

    return { id: noteId, pinned };
  } catch (error) {
    throw new ExpressError(500, "Failed to update note in db.");
  }
}

export async function getUserNotes(userId: string) {
  try {
    const sql =
      "SELECT note_id AS id, title, content, pinned, pinned_at AS pinnedAt, position FROM notes WHERE user_id = ? ORDER BY position ASC";
    const values = [userId];

    const [notes] = await db.query<DBNote[]>(sql, values);
    return notes;
  } catch (error) {
    throw new ExpressError(500, "Failed to fetch notes from db.");
  }
}

export async function getNoteById(noteId: string) {
  try {
    const sql =
      "SELECT note_id AS id, title, content, pinned, pinned_at AS pinnedAt, position FROM notes WHERE note_id = ?";
    const values = [noteId];

    const [notes] = await db.query<DBNote[]>(sql, values);
    return notes[0];
  } catch (error) {
    throw new ExpressError(500, "Failed to find note in db.");
  }
}

export async function deleteNote(noteId: string) {
  try {
    const sql = "DELETE FROM notes WHERE note_id = ?";
    const values = [noteId];

    await db.query<DBNote[]>(sql, values);
    return { id: noteId };
  } catch (error) {
    throw new ExpressError(500, "Failed to delete note from db.");
  }
}
