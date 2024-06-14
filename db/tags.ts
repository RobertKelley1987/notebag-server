import db from "./config";
import { v4 as uuid } from "uuid";
import { ExpressError } from "../util/express-error";
import type { QueryError, RowDataPacket } from "mysql2";

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

    return { id: tagId, name: name };
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to create new tag.");
  }
}

export async function getUserTags(userId: string) {
  try {
    const sql =
      "SELECT * FROM user_tags WHERE user_id = ? JOIN tags ON tag_id = tags.tag_id";
    const values = [userId];
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to fetch user tags.");
  }
}
