import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/user.model.js";
import { generateToken } from "./jwt.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["callBackUrl_GOOGLE"],
      scope: ["profile", "email"],
      prompt: "select_account consent",
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile) {
        return done(null, false);
      }
      var user = {
        userName: profile.name.givenName,
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: profile.provider,
      };

      try {
        const userInDb = await userModel.findOne({ googleId: user.googleId });
        if (!userInDb) {
          try {
            const created = await userModel.create(user);
            if (!created) {
              return done(new Error("User creation failed"));
            }
            const token = generateToken(created._id);
            return done(null, { user: created, token });
          } catch (err) {
            return done(err);
          }
        } else {
          const updatedUser = await userModel.findOneAndUpdate(
            { googleId: user.googleId },
            {
              lastLogin: new Date(),
            },
            { new: true }
          );
          const token = generateToken(updatedUser._id);
          return done(null, { user: updatedUser, token });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env["GITHUB_CLIENT_ID"],
      clientSecret: process.env["GITHUB_CLIENT_SECRET"],
      callbackURL: process.env["callBackUrl_GITHUB"],
      scope: ["profile", "email"],
      prompt: "select_account consent",
    },
    async (accessToken, refreshToken, profile, done) => {

      if (!profile) {
        return done(null, false);
      }
      var user = {
        userName: profile.username,
        githubId: profile.id,
        displayName: profile.displayName || profile.userName,
        avatar: profile.photos[0].value,
        provider: profile.provider,
      };

      try {
        const userInDb = await userModel.findOne({ githubId: user.githubId });
        if (!userInDb) {
          try {
            const created = await userModel.create(user);
            if (!created) {
              return done(new Error("User creation failed"));
            }
            const token = generateToken(created._id);
            return done(null, { user: created, token });
          } catch (err) {
            return done(err);
          }
        } else {
          const updatedUser = await userModel.findOneAndUpdate(
            { githubId: user.githubId },
            {
              lastLogin: new Date(),
            },
            { new: true }
          );
          const token = generateToken(updatedUser._id);
          return done(null, { user: updatedUser, token });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
