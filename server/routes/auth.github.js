import express from "express";
import passport from "passport";
import { generateAuthCode } from "../lib/authCode.js";

const githubAuthRouter = express.Router();

githubAuthRouter.get("/", passport.authenticate("github"));

githubAuthRouter.get(
  "/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { token } = req.user;
    const code = generateAuthCode(token);
    res.redirect(`${process.env.CLIENT_URL}/api/oauth/github?code=${code}`);
  }
);

export default githubAuthRouter;
