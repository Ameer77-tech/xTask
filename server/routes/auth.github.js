import express from "express";
import passport from "passport";

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
    res.redirect(`${process.env.CLIENT_URL}/api/oauth/github?token=${token}`);
  }
);

export default githubAuthRouter;
