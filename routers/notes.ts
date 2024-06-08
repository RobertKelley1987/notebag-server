import express from "express";
import notes from "../controllers/notes";
import { auth } from "../middleware";
const router = express.Router({ mergeParams: true });

router.use(auth);
router.get("/", notes.findAll);
router.post("/", notes.create);
router.put("/:noteId", notes.update);

export default router;
