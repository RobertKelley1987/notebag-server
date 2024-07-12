import { Request, Response } from "express";
import { createTag, deleteTag, getUserTags, updateTag } from "../db/tags";
import { ExpressError } from "../lib/express-error";

const tags = {
  create: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tagId, name } = req.body;
    if (!tagId) {
      throw new ExpressError(400, "Tag id is required to create a new tag.");
    }
    if (!name) {
      throw new ExpressError(400, "Name is required to create a new tag.");
    }

    const allTags = await getUserTags(userId);
    if (allTags.findIndex((tag) => tag.name === name) !== -1) {
      throw new ExpressError(400, "Tag already exists.");
    }

    const newTag = await createTag(userId, tagId, name);
    res.status(201).send({ tag: newTag });
  },
  update: async (req: Request, res: Response) => {
    const { tagId } = req.params;
    const { name } = req.body;
    if (!name) {
      throw new ExpressError(400, "Name is required to update a tag.");
    }

    const updatedTag = await updateTag(tagId, name);
    res.status(201).send({ tag: updatedTag });
  },
  findByUser: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const tags = await getUserTags(userId);
    res.status(200).send({ tags });
  },
  delete: async (req: Request, res: Response) => {
    const { tagId } = req.params;
    const { id } = await deleteTag(tagId);
    res.status(200).send({ id });
  },
};

export default tags;
