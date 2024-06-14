import express from "express";
import expressSession from "./session";
import userRoutes from "./routers/users";
import noteRoutes from "./routers/notes";
import tagRoutes from "./routers/tags";
import { errorHandler } from "./error-handler";

const port = process.env.PORT;

declare module "express-session" {
  interface SessionData {
    userId: string | null;
  }
}

const app = express();

app.use(express.json());
app.use(expressSession());

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/tags", tagRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`The server listens on port ${port}`));
