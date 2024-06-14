import express from "express";
import tags from "../controllers/tags";
import { auth } from "../middleware";
const router = express.Router({ mergeParams: true });

router.use(auth);
router.get("/", tags.findByUser);
router.post("/", tags.create);

export default router;
