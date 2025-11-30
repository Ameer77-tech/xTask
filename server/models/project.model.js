import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  dueDate: {
    type: Date,
    default: null,
    required: true,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  status: {
    type: String,
    enum: ["not-started", "in-progress", "planning", "completed"],
    default: "not-started",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  totaltasksCompleted: {
    type: Number,
    default: 0,
  },
  tasks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tasks",
    default: [],
  },
});

const projectsModel = mongoose.model("projects", projectSchema);

export default projectsModel;
