import { Request, Response } from "express";
import { createTag, getUserTags } from "../db/tags";

const tags = {
  create: async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const { name } = req.body;
    const newTag = await createTag(userId, name);
    res.status(200).send({ tag: newTag });
  },
  findByUser: async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const tags = await getUserTags(userId);
    res.status(200).send({ tags });
  },
};

export default tags;
