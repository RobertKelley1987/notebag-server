import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../lib/express-error";
import type { RowDataPacket } from "mysql2";

interface DBNoteTag extends RowDataPacket {
  note_tag_id: string;
  note_id: string;
  tag_id: string;
}

export async function createNoteTag(noteId: string, tagId: string) {
  try {
    const noteTagId = uuid();
    const sql =
      "INSERT INTO note_tags(note_tag_id, note_id, tag_id) VALUES(?, ?, ?)";
    const values = [noteTagId, noteId, tagId];
    await db.query<DBNoteTag[]>(sql, values);
    return { noteTagId, noteId, tagId };
  } catch (error) {
    throw new ExpressError(500, "Failed to add tag to note in db.");
  }
}

export async function deleteNoteTag(noteId: string, tagId: string) {
  try {
    const sql = "DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?";
    const values = [noteId, tagId];
    await db.query<DBNoteTag[]>(sql, values);
    return { noteId, tagId };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to delete tag from note in db.");
  }
}

export async function deleteAllNoteTags(noteId: string) {
  try {
    const sql = "DELETE FROM note_tags WHERE note_id = ?";
    const values = [noteId];
    await db.query<DBNoteTag[]>(sql, values);
    return { noteId };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to delete tag from note in db.");
  }
}

export async function findNoteTags(noteId: string) {
  try {
    const sql =
      "SELECT note_tag_id AS id, note_id AS noteId, tag_id AS tagId FROM note_tags WHERE note_id = ?";
    const values = [noteId];
    const [rows] = await db.query<DBNoteTag[]>(sql, values);
    return rows;
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to fetch note tags from db.");
  }
}
