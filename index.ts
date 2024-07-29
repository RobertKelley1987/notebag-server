import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routers/users";
import noteRoutes from "./routers/notes";
import tagRoutes from "./routers/tags";
import tokenRoutes from "./routers/tokens";
import { errorHandler } from "./error-handler";

const port = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());

// Use cors in production only
if (process.env.NODE_ENV !== "development") {
  app.use(
    cors({
      origin: "https://notebag.site",
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  );
}

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/tags", tagRoutes);
app.use("/tokens", tokenRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`The server listens on port ${port}`));
