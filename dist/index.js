"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routers/users"));
const notes_1 = __importDefault(require("./routers/notes"));
const tags_1 = __importDefault(require("./routers/tags"));
const tokens_1 = __importDefault(require("./routers/tokens"));
const error_handler_1 = require("./error-handler");
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Use cors in production only
if (process.env.NODE_ENV !== "development") {
    app.use((0, cors_1.default)({
        origin: "https://notebag.site",
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
    }));
}
app.use("/users", users_1.default);
app.use("/notes", notes_1.default);
app.use("/tags", tags_1.default);
app.use("/tokens", tokens_1.default);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log(`The server listens on port ${port}`));
