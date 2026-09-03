import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "task",
  }
);

// ==========================================
// INDEXES
// ==========================================

// Most important:
// Find todos belonging to a user and sort
// them by creation date.
todoSchema.index({
  user: 1,
  createdAt: -1,
});

// User + completed status
todoSchema.index({
  user: 1,
  completed: 1,
});

// User + priority
todoSchema.index({
  user: 1,
  priority: 1,
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;