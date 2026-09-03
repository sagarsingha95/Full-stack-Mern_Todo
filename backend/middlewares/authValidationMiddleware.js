const validateRegister = (req, res, next) => {
  const errors = [];

  const { name, email, password } = req.body;

  // ==============================
  // NAME
  // ==============================

  if (name === undefined) {
    errors.push("Name is required.");
  } else if (typeof name !== "string") {
    errors.push("Name must be a string.");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  } else if (name.trim().length > 50) {
    errors.push("Name cannot exceed 50 characters.");
  }

  // ==============================
  // EMAIL
  // ==============================

  if (email === undefined) {
    errors.push("Email is required.");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string.");
  } else {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim().toLowerCase())) {
      errors.push("Please provide a valid email address.");
    }
  }

  // ==============================
  // PASSWORD
  // ==============================

  if (password === undefined) {
    errors.push("Password is required.");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string.");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  } else if (password.length > 128) {
    errors.push("Password cannot exceed 128 characters.");
  }

  // ==============================
  // RETURN ERRORS
  // ==============================

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};


const validateLogin = (req, res, next) => {
  const errors = [];

  const { email, password } = req.body;

  // ==============================
  // EMAIL
  // ==============================

  if (email === undefined) {
    errors.push("Email is required.");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string.");
  } else {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      errors.push("Please provide a valid email address.");
    }
  }

  // ==============================
  // PASSWORD
  // ==============================

  if (password === undefined) {
    errors.push("Password is required.");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string.");
  } else if (password.length === 0) {
    errors.push("Password is required.");
  } else if (password.length > 128) {
    errors.push("Password cannot exceed 128 characters.");
  }

  // ==============================
  // RETURN ERRORS
  // ==============================

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};


export {
  validateRegister,
  validateLogin,
};