import session from "express-session";
import { ExpressError } from "./util/express-error";

const expressSession = () => {
  if (!process.env.SECRET) {
    throw new ExpressError(
      500,
      "Secret required to configure express-session."
    );
  }

  return session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
  });
};

export default expressSession;
