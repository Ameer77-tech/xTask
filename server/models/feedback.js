import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  feedback: String,
  receivedAt: {
    type: Date,
    default: new Date().toLocaleDateString("en-US"),
  },
});

export default mongoose.model("feedbacks", feedbackSchema);
