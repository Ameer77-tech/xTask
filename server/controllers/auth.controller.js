import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.js";
import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";

export const registerUser = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  } else if (
    data.userName == "" ||
    data.displayName == "" ||
    data.password == ""
  ) {
    return res
      .status(400)
      .json({ reply: "All Fields Must be Filled", success: false });
  } else {
    try {
      const exists = await userModel.find({
        userName: data.userName,
        provider: "local",
      });
      if (exists.length > 0) {
        return res.status(409).json({
          reply: "User with that username already exists.",
          success: false,
          userExistsError: true,
        });
      } else {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = {
          userName: data.userName,
          displayName: data.displayName,
          password: hashedPassword,
          provider: "local",
        };
        try {
          const created = await userModel.create(user);
          const token = generateToken(created._id);
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          return res
            .status(200)
            .json({ reply: "SignUp Success", success: true });
        } catch (err) {
          if (err.code === 11000) {
            console.error("Server error:", err);
            return res.status(409).json({
              success: false,
              message: "User with that username already exists.",
            });
          }
          console.error("Server error:", err);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ reply: "Server Error", success: false, err });
    }
  }
};

export const verifyUser = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res
      .status(400)
      .json({ reply: "Fields Can't Be Empty", success: false });
  } else if (data.userName == "" || data.password == "") {
    return res
      .status(400)
      .json({ reply: "All Fields Must be Filled", success: false });
  } else {
    try {
      const user = await userModel
        .findOne({ userName: data.userName, provider: "local" })
        .select("password");

      if (!user) {
        return res
          .status(401)
          .json({ reply: "User Not Found", success: false });
      } else {
        const matched = await bcrypt.compare(data.password, user.password);
        if (!matched) {
          return res
            .status(401)
            .json({ reply: "Incorrect Password", success: false });
        } else {
          const token = generateToken(user._id);
          ``;
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          return res
            .status(200)
            .json({ reply: "Login Success", success: true });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ reply: "Server Error", success: false, err });
    }
  }
};

export const logOutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ reply: "User logged out successfully", success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ reply: "Server error", success: false, error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    await Promise.all([
      userModel.deleteOne({ _id: userId }),
      tasksModel.deleteMany({ createdBy: userId }),
      projectsModel.deleteMany({ createdBy: userId }),
    ]);

    return res.status(200).json({
      success: true,
      reply: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Delete Account Error:", err);
    return res.status(500).json({
      success: false,
      reply: "Internal Server Error",
    });
  }
};
