import express from "express";
import tokens from "../controllers/tokens";
const router = express.Router({ mergeParams: true });

router.get("/", tokens.create);

export default router;
