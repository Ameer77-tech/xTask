import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
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

userSchema.index({ userName: 1, provider: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", userSchema);
