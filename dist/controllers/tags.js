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
const express_error_1 = require("../lib/express-error");
const tags = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const { tagId, name } = req.body;
        if (!tagId) {
            throw new express_error_1.ExpressError(400, "Tag id is required to create a new tag.");
        }
        if (!name) {
            throw new express_error_1.ExpressError(400, "Name is required to create a new tag.");
        }
        const allTags = yield (0, tags_1.getUserTags)(userId);
        if (allTags.findIndex((tag) => tag.name === name) !== -1) {
            throw new express_error_1.ExpressError(400, "Tag already exists.");
        }
        const newTag = yield (0, tags_1.createTag)(userId, tagId, name);
        res.status(201).send({ tag: newTag });
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tagId } = req.params;
        const { name } = req.body;
        if (!name) {
            throw new express_error_1.ExpressError(400, "Name is required to update a tag.");
        }
        const updatedTag = yield (0, tags_1.updateTag)(tagId, name);
        res.status(201).send({ tag: updatedTag });
    }),
    findByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const tags = yield (0, tags_1.getUserTags)(userId);
        res.status(200).send({ tags });
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tagId } = req.params;
        const { id } = yield (0, tags_1.deleteTag)(tagId);
        res.status(200).send({ id });
    }),
};
exports.default = tags;
