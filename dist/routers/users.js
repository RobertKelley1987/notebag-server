"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const router = express_1.default.Router({ mergeParams: true });
router.post("/register", users_1.default.register);
router.post("/login", users_1.default.login);
router.post("/logout", users_1.default.logout);
router.get("/sessions", users_1.default.getSession);
exports.default = router;
