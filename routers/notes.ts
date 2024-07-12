import express from "express";
import notes from "../controllers/notes";
import { authorizeToken } from "../middleware";
const router = express.Router({ mergeParams: true });

router.use(authorizeToken);
router.get("/", notes.findAll);
router.post("/", notes.create);
router.get("/:noteId", notes.findOne);
router.put("/:noteId", notes.update);
router.put("/:noteId/tags", notes.updateTags);
router.put("/:noteId/pinned", notes.updatePinned);
router.delete("/:noteId", notes.delete);

export default router;
