import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: "String",
    },
    displayName: {
      type: "String",
    },
    email: {
      type: String,
      required: function () {
        return this.googleId && this.githubId;
      },
      default: "",
      lowercase: true,
      trim: true,
    },
    avatar: { type: String },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId;
      },
      select: false,
    },
    googleId: { type: String, index: true, sparse: true },
    githubId: { type: String, index: true, sparse: true },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    tasks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
    projects: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
