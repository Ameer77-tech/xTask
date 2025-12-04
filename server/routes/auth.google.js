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
    });
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

export default googleAuthRouter;
