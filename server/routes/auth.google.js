import express from "express";
import passport from "passport";

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

export default googleAuthRouter;
