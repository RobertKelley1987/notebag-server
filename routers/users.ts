import express from "express";
import users from "../controllers/users";
const router = express.Router({ mergeParams: true });

router.post("/register", users.register);
router.post("/login", users.login);
router.post("/logout", users.logout);

export default router;
