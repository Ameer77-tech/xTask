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
      const email =
        profile.emails && profile.emails[0] && profile.emails[0].value
          ? profile.emails[0].value.toLowerCase().trim()
          : "";
      const avatar =
        profile.photos && profile.photos[0] && profile.photos[0].value
          ? profile.photos[0].value
          : "";

      const user = {
        userName: profile.name?.givenName || profile.displayName || `google_${profile.id}`,
        googleId: profile.id,
        displayName: profile.displayName || profile.name?.givenName || "User",
        email,
        avatar,
        provider: profile.provider || "google",
      };

      try {
        // 1. Check if user exists by googleId
        let existingUser = await userModel.findOne({ googleId: user.googleId });

        // 2. If not found by googleId, check by email to safely link accounts
        if (!existingUser && user.email) {
          existingUser = await userModel.findOne({ email: user.email });
        }

        if (!existingUser) {
          const created = await userModel.create(user);
          if (!created) {
            return done(new Error("User creation failed"));
          }
          const token = generateToken(created._id);
          return done(null, { user: created, token });
        } else {
          const updateFields = {
            lastLogin: new Date(),
            ...(existingUser.googleId ? {} : { googleId: user.googleId }),
            ...(!existingUser.avatar && user.avatar ? { avatar: user.avatar } : {}),
          };
          const updatedUser = await userModel.findByIdAndUpdate(
            existingUser._id,
            updateFields,
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
      const email =
        profile.emails && profile.emails[0] && profile.emails[0].value
          ? profile.emails[0].value.toLowerCase().trim()
          : "";
      const avatar =
        profile.photos && profile.photos[0] && profile.photos[0].value
          ? profile.photos[0].value
          : "";

      const user = {
        userName: profile.username || `github_${profile.id}`,
        githubId: profile.id,
        displayName: profile.displayName || profile.username || "User",
        email,
        avatar,
        provider: profile.provider || "github",
      };

      try {
        // 1. Check if user exists by githubId
        let existingUser = await userModel.findOne({ githubId: user.githubId });

        // 2. If not found by githubId, check by email to safely link accounts
        if (!existingUser && user.email) {
          existingUser = await userModel.findOne({ email: user.email });
        }

        if (!existingUser) {
          const created = await userModel.create(user);
          if (!created) {
            return done(new Error("User creation failed"));
          }
          const token = generateToken(created._id);
          return done(null, { user: created, token });
        } else {
          const updateFields = {
            lastLogin: new Date(),
            ...(existingUser.githubId ? {} : { githubId: user.githubId }),
            ...(!existingUser.avatar && user.avatar ? { avatar: user.avatar } : {}),
          };
          const updatedUser = await userModel.findByIdAndUpdate(
            existingUser._id,
            updateFields,
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
