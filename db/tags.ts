import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../lib/express-error";
import type { RowDataPacket } from "mysql2";

interface DBTag extends RowDataPacket {
  tag_id: string;
  name: string;
}

interface DBUserTag extends RowDataPacket {
  tag_id: string;
  user_id: string;
}

export async function createTag(userId: string, name: string) {
  try {
    // Create new tag
    const tagId = uuid();
    const tagSql = "INSERT INTO tags(tag_id, name) VALUES(?, ?)";
    const tagValues = [tagId, name];
    await db.query<DBTag[]>(tagSql, tagValues);

    // Attach tag to user
    const userTagId = uuid();
    const userTagSql =
      "INSERT INTO user_tags(user_tag_id, user_id, tag_id) VALUES(?, ?, ?)";
    const userTagValues = [userTagId, userId, tagId];
    await db.query<DBUserTag[]>(userTagSql, userTagValues);

    // Return result
    return { id: tagId, name: name };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to create new tag in db.");
  }
}

export async function getUserTags(userId: string) {
  try {
    const sql =
      "SELECT tags.name, tags.tag_id AS id FROM user_tags RIGHT JOIN tags ON user_tags.tag_id = tags.tag_id WHERE user_id = ? ORDER BY name ASC";
    const values = [userId];
    const [rows] = await db.query<DBTag[]>(sql, values);
    return rows;
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to fetch user tags from db.");
  }
}

export async function getNoteTags(tagId: string) {
  try {
    const sql =
      "SELECT tags.name, tags.tag_id AS id FROM note_tags RIGHT JOIN tags ON note_tags.tag_id = tags.tag_id WHERE note_id = ? ORDER BY name ASC";
    const values = [tagId];
    const [rows] = await db.query<DBTag[]>(sql, values);
    return rows;
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to fetch note tags from db.");
  }
}

export async function deleteTag(tagId: string) {
  try {
    const sql = "DELETE FROM tags WHERE tag_id = ?";
    const values = [tagId];
    await db.query<DBTag[]>(sql, values);
    return { id: tagId };
  } catch (error) {
    throw new ExpressError(500, "Failed to delete tag from db.");
  }
}
