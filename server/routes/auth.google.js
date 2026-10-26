import express from "express";
import passport from "passport";
import { generateAuthCode } from "../lib/authCode.js";

const googleAuthRouter = express.Router();

googleAuthRouter.get("/", passport.authenticate("google"));

googleAuthRouter.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { token } = req.user;
    const code = generateAuthCode(token);
    res.redirect(`${process.env.CLIENT_URL}/api/oauth/google?code=${code}`);
  }
);

export default googleAuthRouter;
