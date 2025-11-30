import userModel from "../models/user.model.js";

export const getDashboardData = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findOne({ _id: id });
    if (user === null) {
      return res.status(401).json({ reply: "Unauthorized", success: false });
    }
    res.status(200).json({
      reply: {
        displayName: user.displayName,
        email: !user.email == "" ? user.email : user.userName,
        avatar: user.avatar,
      },
      success: true,
    });
  } catch (err) {
    res.status(500).json({ reply: "Internal Server Error", success: false });
  }
};
