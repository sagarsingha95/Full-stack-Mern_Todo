const validate = (req, res, next) => {
  const errors = [];

  if (req.body.title !== undefined) {
    if (typeof req.body.title !== "string") {
      errors.push("Title must be a string.");
    } else if (req.body.title.trim().length < 2) {
      errors.push("Title must be at least 2 characters.");
    } else if (req.body.title.trim().length > 100) {
      errors.push("Title cannot exceed 100 characters.");
    }
  }

  if (req.body.description !== undefined) {
    if (typeof req.body.description !== "string") {
      errors.push("Description must be a string.");
    } else if (req.body.description.trim().length < 2) {
      errors.push(
        "Description must be at least 2 characters.",
      );
    } else if (req.body.description.trim().length > 500) {
      errors.push(
        "Description cannot exceed 500 characters.",
      );
    }
  }

  if (req.body.priority !== undefined) {
    const validPriorities = [
      "low",
      "medium",
      "high",
    ];

    if (!validPriorities.includes(req.body.priority)) {
      errors.push(
        "Priority must be low, medium, or high.",
      );
    }
  }

  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      errors.push(
        "Completed must be a boolean.",
      );
    }
  }

  if (
    req.body.dueDate !== undefined &&
    req.body.dueDate !== null &&
    req.body.dueDate !== ""
  ) {
    const date = new Date(req.body.dueDate);

    if (Number.isNaN(date.getTime())) {
      errors.push("Due date must be a valid date.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export default validate;