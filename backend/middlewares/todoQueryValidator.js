const validateTodoQuery = (req, res, next) => {
  const errors = [];

  const {
    page = "1",
    limit = "6",
    search = "",
    status = "all",
    sort = "newest",
  } = req.query;

  // ==========================================
  // PAGE
  // ==========================================

  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    errors.push("Page must be a positive integer.");
  }

  // ==========================================
  // LIMIT
  // ==========================================

  const limitNumber = Number(limit);

  if (!Number.isInteger(limitNumber) || limitNumber < 1) {
    errors.push("Limit must be a positive integer.");
  } else if (limitNumber > 50) {
    errors.push("Limit cannot exceed 50.");
  }

  // ==========================================
  // SEARCH
  // ==========================================

  if (typeof search !== "string") {
    errors.push("Search must be a string.");
  } else if (search.length > 100) {
    errors.push("Search cannot exceed 100 characters.");
  }

  // ==========================================
  // STATUS
  // ==========================================

  const validStatuses = [
    "all",
    "completed",
    "pending",
  ];

  if (!validStatuses.includes(status)) {
    errors.push(
      "Status must be all, completed, or pending."
    );
  }

  // ==========================================
  // SORT
  // ==========================================

  const validSortOptions = [
    "newest",
    "oldest",
    "az",
    "za",
    "priority",
  ];

  if (!validSortOptions.includes(sort)) {
    errors.push(
      "Sort must be newest, oldest, az, za, or priority."
    );
  }

  // ==========================================
  // RETURN VALIDATION ERRORS
  // ==========================================

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors,
    });
  }

  // ==========================================
  // NORMALIZE QUERY PARAMETERS
  // ==========================================

  req.query.page = pageNumber;
  req.query.limit = limitNumber;
  req.query.search = search.trim();
  req.query.status = status;
  req.query.sort = sort;

  next();
};

export default validateTodoQuery;