import express from "express";
import users from "../controllers/users";
const router = express.Router({ mergeParams: true });

router.post("/register", users.register);

export default router;
