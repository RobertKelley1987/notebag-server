"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tags_1 = __importDefault(require("../controllers/tags"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router({ mergeParams: true });
router.use(middleware_1.auth);
router.get("/", tags_1.default.findByUser);
router.post("/", tags_1.default.create);
router.delete("/:tagId", tags_1.default.delete);
exports.default = router;
