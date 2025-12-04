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
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
       domain: "x-task-rho.vercel.app"
    });
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

export default githubAuthRouter;
