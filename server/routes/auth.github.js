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
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

export default githubAuthRouter;
