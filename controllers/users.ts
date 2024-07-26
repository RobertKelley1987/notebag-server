import bcrypt from "bcryptjs";
import { ExpressError } from "../lib/express-error";
import { createUser, getUserByEmail, getUserByToken } from "../db/users";
import { deleteRefreshToken } from "../db/tokens";
import { generateTokens } from "../lib/tokens";
import type { Request, Response } from "express";
import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
};

if (process.env.NODE_ENV !== "development") {
  cookieOptions.domain = "notebag.site";
  cookieOptions.secure = false;
}

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

    res.cookie("jwt", refreshToken, cookieOptions);
    res.status(201).json({ accessToken });
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ExpressError(400, "Email and password are both required.");
    }

    const foundUser = await getUserByEmail(email);
    if (!foundUser) throw new ExpressError(400, "Invalid credentials.");

    const passwordValidated = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (passwordValidated) {
      const { accessToken, refreshToken } = await generateTokens({
        id: foundUser.id,
      });

      res.cookie("jwt", refreshToken, cookieOptions);
      return res.status(201).json({ accessToken });
    }

    throw new ExpressError(400, "Invalid credentials.");
  },
  logout: async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies) {
      return res.status(204).send({ message: "User is not logged in. " });
    }

    const refreshToken = cookies.jwt;

    // If user with token is not found, clear cookies and return response.
    const foundUser = await getUserByToken(refreshToken);
    if (!foundUser) {
      res.clearCookie("jwt", cookieOptions);
      return res.status(200).send({ success: "User is logged out. " });
    }

    // Delete refresh token from user, clear cookie and return response.
    await deleteRefreshToken(foundUser.id);
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).send({ success: "User is logged out." });
  },
};

export default users;
