import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../util/express-error";

type DBNote = {
  note_id: string;
  user_id?: string;
  title?: string;
  content?: string;
};

const formatNote = (note: DBNote) => {
  delete note.user_id;
  const { note_id, title, content } = note;
  return { id: note_id, title, content };
};

export async function createNote(
  noteId: string,
  userId: string,
  title: string,
  content: string
) {
  try {
    const sql =
      "INSERT INTO notes(note_id, title, content, user_id) VALUES(?, ?, ?, ?)";
    const values = [noteId, title, content, userId];
    await db.query(sql, values);

    return { id: noteId, title, content };
  } catch (error) {
    console.log(error);
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
    await db.query(sql, values);

    return { id: noteId, title, content };
  } catch (error) {
    throw new ExpressError(500, "Failed to update note in db.");
  }
}

export async function getUserNotes(userId: string) {
  try {
    const sql = "SELECT * FROM notes WHERE user_id = ?";
    const values = [userId];

    const [notes] = await db.query(sql, values);
    return (notes as DBNote[]).map((note) => formatNote(note));
  } catch (error) {
    throw new ExpressError(500, "Failed to fetch notes from db.");
  }
}
