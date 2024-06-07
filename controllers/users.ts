import bcrypt from "bcryptjs";
import { ExpressError } from "../util/express-error";
import { create } from "../db/users";
import type { Request, Response } from "express";

const users = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ExpressError(400, "Email and password are both required.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await create(email, hashedPassword);
    req.session.userId = newUser.id;

    res.status(200).send({ user: newUser });
  },
};

export default users;
