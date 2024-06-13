import db from "./config";
import { ExpressError } from "../util/express-error";
import type { RowDataPacket } from "mysql2";

interface DBNote extends RowDataPacket {
  note_id: string;
  user_id?: string;
  title?: string;
  content?: string;
  position: number;
}

const formatNote = (note: DBNote) => {
  delete note.user_id;
  const { note_id, title, content, position } = note;
  return { id: note_id, title, content, position };
};

export async function createNote(
  noteId: string,
  userId: string,
  title: string,
  content: string
) {
  try {
    // Shift position of all user notes.
    const posSql = "UPDATE notes SET position = position + 1 WHERE user_id = ?";
    const posValues = [userId];
    await db.query<DBNote[]>(posSql, posValues);

    // Insert new note at position zero.
    const sql =
      "INSERT INTO notes(note_id, title, content, user_id) VALUES(?, ?, ?, ?)";
    const values = [noteId, title, content, userId];
    await db.query<DBNote[]>(sql, values);

    return { id: noteId, title, content, position: 0 };
  } catch (error) {
    throw new ExpressError(500, "Failed to create new note in db.");
  }
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string
) {
  try {
    const sql = "UPDATE notes SET title = ?, content = ? WHERE note_id = ?";
    const values = [title, content, noteId];
    await db.query<DBNote[]>(sql, values);

    return { id: noteId, title, content };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to update note in db.");
  }
}

export async function getUserNotes(userId: string) {
  try {
    const sql = "SELECT * FROM notes WHERE user_id = ? ORDER BY position ASC";
    const values = [userId];

    const [notes] = await db.query<DBNote[]>(sql, values);
    return notes.map((note) => formatNote(note));
  } catch (error) {
    throw new ExpressError(500, "Failed to fetch notes from db.");
  }
}

export async function getNoteById(noteId: string) {
  try {
    const sql = "SELECT * FROM notes WHERE note_id = ?";
    const values = [noteId];

    const [notes] = await db.query<DBNote[]>(sql, values);
    return formatNote(notes[0]);
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
