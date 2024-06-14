"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = require("../db/tags");
const tags = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.session.userId;
        const { name } = req.body;
        const newTag = yield (0, tags_1.createTag)(userId, name);
        res.status(200).send({ tag: newTag });
    }),
    findByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.session.userId;
        const tags = yield (0, tags_1.getUserTags)(userId);
        res.status(200).send({ tags });
    }),
};
exports.default = tags;
