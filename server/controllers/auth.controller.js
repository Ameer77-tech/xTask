import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.js";
import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";

export const registerUser = async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  }

  const { userName, displayName, password } = data;
  if (
    !userName ||
    typeof userName !== "string" ||
    userName.trim() === "" ||
    !displayName ||
    typeof displayName !== "string" ||
    displayName.trim() === "" ||
    !password ||
    typeof password !== "string" ||
    password === ""
  ) {
    return res
      .status(400)
      .json({ reply: "All Fields Must be Filled", success: false });
  }

  const exists = await userModel.find({
    userName: userName.trim(),
    provider: "local",
  });
  if (exists.length > 0) {
    return res.status(409).json({
      reply: "User with that username already exists.",
      success: false,
      userExistsError: true,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    userName: userName.trim(),
    displayName: displayName.trim(),
    password: hashedPassword,
    provider: "local",
  };

  const created = await userModel.create(user);
  const token = generateToken(created._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res
    .status(200)
    .json({ reply: "SignUp Success", success: true });
};

export const verifyUser = async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  }

  const { userName, password } = data;
  if (
    !userName ||
    typeof userName !== "string" ||
    userName.trim() === "" ||
    !password ||
    typeof password !== "string" ||
    password === ""
  ) {
    return res
      .status(400)
      .json({ reply: "All Fields Must be Filled", success: false });
  }

  const user = await userModel
    .findOne({ userName: userName.trim(), provider: "local" })
    .select("password");

  if (!user) {
    return res
      .status(401)
      .json({ reply: "User Not Found", success: false });
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return res
      .status(401)
      .json({ reply: "Incorrect Password", success: false });
  }

  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res
    .status(200)
    .json({ reply: "Login Success", success: true });
};

export const logOutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res
    .status(200)
    .json({ reply: "User logged out successfully", success: true });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  await Promise.all([
    userModel.deleteOne({ _id: userId }),
    tasksModel.deleteMany({ createdBy: userId }),
    projectsModel.deleteMany({ createdBy: userId }),
  ]);

  return res.status(200).json({
    success: true,
    reply: "Account deleted successfully",
  });
};
