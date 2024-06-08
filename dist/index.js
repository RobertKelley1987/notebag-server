"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_1 = __importDefault(require("./session"));
const users_1 = __importDefault(require("./routers/users"));
const notes_1 = __importDefault(require("./routers/notes"));
const error_handler_1 = require("./error-handler");
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, session_1.default)());
app.use("/users", users_1.default);
app.use("/notes", notes_1.default);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log(`The server listens on port ${port}`));
