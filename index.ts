import express from "express";
import expressSession from "./session";
const port = process.env.PORT;

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const app = express();

app.use(express.json());
app.use(expressSession());

app.listen(port, () => console.log(`The server listens on port ${port}`));
