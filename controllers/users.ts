import bcrypt from "bcryptjs";
import { ExpressError } from "../lib/express-error";
import { createUser, getUserByEmail } from "../db/users";
import { generateTokens } from "../lib/tokens";
import type { Request, Response } from "express";
import { deleteRefreshToken } from "../db/tokens";

const users = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ExpressError(400, "Email and password are both required.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createUser(email, hashedPassword);

    const { accessToken, refreshToken } = await generateTokens({
      id: newUser.id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken });
  },
  login: async (req: Request, res: Response) => {
    console.log("LOG IN");
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
      const { accessToken, refreshToken } = await generateTokens({
        id: foundUser.id,
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ accessToken });
    }

    throw new ExpressError(400, "Invalid credentials.");
  },
  logout: async (req: Request, res: Response) => {
    await deleteRefreshToken(req.body.token);
    return res.status(200).send({ success: "User is logged out." });
  },
};

export default users;
