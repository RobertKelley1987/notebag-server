import express from "express";
import tags from "../controllers/tags";
import { authorizeToken } from "../middleware";
const router = express.Router({ mergeParams: true });

router.use(authorizeToken);
router.get("/", tags.findByUser);
router.post("/", tags.create);
router.delete("/:tagId", tags.delete);

export default router;
