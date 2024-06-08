"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notes_1 = __importDefault(require("../controllers/notes"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router({ mergeParams: true });
router.use(middleware_1.auth);
router.get("/", notes_1.default.findAll);
router.post("/", notes_1.default.create);
router.put("/:noteId", notes_1.default.update);
exports.default = router;
