"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notes_1 = __importDefault(require("../controllers/notes"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router({ mergeParams: true });
router.use(middleware_1.authorizeToken);
router.get("/", notes_1.default.findAll);
router.post("/", notes_1.default.create);
router.get("/:noteId", notes_1.default.findOne);
router.put("/:noteId", notes_1.default.update);
router.put("/:noteId/tags", notes_1.default.updateTags);
router.put("/:noteId/pinned", notes_1.default.updatePinned);
router.delete("/:noteId", notes_1.default.delete);
exports.default = router;
