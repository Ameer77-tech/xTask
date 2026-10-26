import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production" ? undefined : "SECRET");

if (
  process.env.NODE_ENV === "production" &&
  (!JWT_SECRET || JWT_SECRET === "SECRET")
) {
  throw new Error(
    "FATAL SECURITY CONFIGURATION: JWT_SECRET must be set to a secure string in production!"
  );
}

export const generateToken = (payload) => {
  const token = jwt.sign({ id: payload }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export const decodeToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ reply: "Unauthorized", success: false });
  }

  let userId;
  try {
    userId = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ reply: "Unauthorized", success: false });
  }

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
    res.status(500).json({
      reply: "Internal Error",
      success: false,
      ...(process.env.NODE_ENV !== "production" && {
        error: err.message,
      }),
    });
  }
};
