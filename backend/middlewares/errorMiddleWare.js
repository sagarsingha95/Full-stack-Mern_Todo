const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // IMAGE SIZE ERROR HANDLING //
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "Profile picture must be smaller than 5MB.",
    });
  }

  // ==========================================
  // REQUEST BODY TOO LARGE
  // ==========================================

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
  }

  // ==========================================
  // MONGODB DUPLICATE KEY
  // ==========================================

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(409).json({
      success: false,
      message: `${field || "Field"} already exists.`,
    });
  }

  // ==========================================
  // MONGOOSE VALIDATION ERROR
  // ==========================================

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  // ==========================================
  // INVALID MONGOOSE OBJECT ID
  // ==========================================

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  // ==========================================
  // JWT ERRORS
  // ==========================================

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired.",
    });
  }

  // ==========================================
  // DEFAULT ERROR
  // ==========================================

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error." : err.message,
  });
};

export default errorMiddleware;
