"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokens_1 = __importDefault(require("../controllers/tokens"));
const router = express_1.default.Router({ mergeParams: true });
router.get("/", tokens_1.default.create);
exports.default = router;
