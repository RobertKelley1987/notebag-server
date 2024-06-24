import type { RowDataPacket } from "mysql2";

export type User = {
  id: string;
};

export interface DBUser extends RowDataPacket {
  user_id: string;
  email: string;
  password: string;
}
