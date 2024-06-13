import bcrypt from "bcryptjs";
import { ExpressError } from "../util/express-error";
import { createUser, getUserByEmail } from "../db/users";
import type { Request, Response } from "express";

const users = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ExpressError(400, "Email and password are both required.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createUser(email, hashedPassword);

    req.session.userId = newUser.id;
    res.status(200).send({ user: newUser });
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ExpressError(400, "Email and password are both required.");
    }

    const foundUser = await getUserByEmail(email).catch((error) => {
      throw new ExpressError(400, "Invalid credentials.");
    });

    const passwordValidated = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (passwordValidated) {
      req.session.userId = foundUser.id;
      res.status(200).send({ user: foundUser });
    }

    throw new ExpressError(400, "Invalid credentials.");
  },
  logout: async (req: Request, res: Response) => {
    req.session.userId = null;
    res.status(200).send({ success: "User successfully logged out " });
  },
  getSession: async (req: Request, res: Response) => {
    console.log("session");
    if (!req.session.userId) {
      res.status(200).send({ userId: "" });
    } else {
      res.status(200).send({ userId: req.session.userId });
    }
  },
};

export default users;
