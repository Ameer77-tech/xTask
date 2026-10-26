import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.js";
import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";
import {
  validateLogin,
  validateRegister,
} from "../validation/auth.validate.js";
import { formatZodError } from "../validation/helpers.js";
import { redeemAuthCode } from "../lib/authCode.js";

export const registerUser = async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  }

  const result = validateRegister.safeParse(data);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  const exists = await userModel.find({
    userName: result.data.userName,
    provider: "local",
  });
  if (exists.length > 0) {
    return res.status(409).json({
      reply: "User with that username already exists.",
      success: false,
      userExistsError: true,
    });
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10);
  const user = {
    userName: result.data.userName,
    displayName: result.data.displayName,
    password: hashedPassword,
    email: result.data.email || "",
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
  return res.status(200).json({ reply: "SignUp Success", success: true });
};

export const verifyUser = async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object") {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  }

  const result = validateLogin.safeParse(data);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  const user = await userModel
    .findOne({ userName: result.data.userName, provider: "local" })
    .select("password");

  if (!user) {
    return res.status(401).json({ reply: "User Not Found", success: false });
  }

  const matched = await bcrypt.compare(result.data.password, user.password);
  console.log(matched);
  
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
  return res.status(200).json({ reply: "Login Success", success: true });
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    reply: "Account deleted successfully",
  });
};

export const exchangeAuthCode = (req, res) => {
  const { code } = req.body || {};
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Authorization code is required",
    });
  }

  const token = redeemAuthCode(code.trim());
  if (!token) {
    return res.status(400).json({
      success: false,
      reply: "Invalid or expired authorization code",
    });
  }

  return res.status(200).json({
    success: true,
    token,
  });
};
