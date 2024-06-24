import { Request, Response } from "express";
import { createTag, deleteTag, getUserTags } from "../db/tags";
import { ExpressError } from "../lib/express-error";

const tags = {
  create: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name) {
      throw new ExpressError(400, "Name is required to create a new tag.");
    }

    const allTags = await getUserTags(userId);
    if (allTags.findIndex((tag) => tag.name === name) !== -1) {
      throw new ExpressError(400, "Tag already exists.");
    }

    const newTag = await createTag(userId, name);
    res.status(201).send({ tag: newTag });
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
