import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const generateToken = (payload) => {
  const token = jwt.sign({ id: payload }, "SECRET", {
    expiresIn: "7d",
  });
  return token;
};

export const decodeToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ reply: "Unauthorized", success: false });
  }
  const userId = jwt.verify(token, "SECRET");

  try {
    const user = await userModel.findOne({ _id: userId.id });
    if (!user) {
      return res
        .status(404)
        .json({ reply: "User Doesnt Exist", success: false });
    } else {
      req.user = userId;
      next();
    }
  } catch (err) {
    res.status(500).json({ reply: "Internal Error", success: false, err });
  }
};
