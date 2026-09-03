import Todo from "../modals/Todo_modal.js";
import escapeRegex from "../utils/escapeRegex.js";

// ======================================================
// GET TODOS
// ======================================================

const getTodos = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = "",
      status = "all",
      sort = "newest",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      user: req.user.userId,
    };

    // Search
    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());

      query.title = {
        $regex: safeSearch,
        $options: "i",
      };
    }

    // Status filter
    if (status === "completed") {
      query.completed = true;
    }

    if (status === "pending") {
      query.completed = false;
    }

    // Sorting
    let sortOption = {};

    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "az") {
      sortOption = { title: 1 };
    }

    if (sort === "za") {
      sortOption = { title: -1 };
    }

    if (sort === "priority") {
      sortOption = { priority: 1 };
    }

    // Get todos
    const todos = await Todo.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // Count filtered todos
    const totalTodos = await Todo.countDocuments(query);

    const totalPages = Math.ceil(totalTodos / limitNumber);

    // Global statistics
    const statisticsQuery = {
      user: req.user.userId,
    };

    const [totalCount, completedCount, pendingCount] = await Promise.all([
      Todo.countDocuments(statisticsQuery),

      Todo.countDocuments({
        ...statisticsQuery,
        completed: true,
      }),

      Todo.countDocuments({
        ...statisticsQuery,
        completed: false,
      }),
    ]);

    res.status(200).json({
      todos,

      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalTodos,
        limit: limitNumber,
      },

      statistics: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CREATE TODO
// ======================================================

const addTodos = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user.userId,
    });

    res.status(201).json({
      todo,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE TODO
// ======================================================

const updateTodos = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: req.user.userId,
      },

      {
        title,
        description,
        completed,
        priority,
        dueDate,
      },

      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found.",
      });
    }

    res.status(200).json({
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE TODO
// ======================================================

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

export { getTodos, addTodos, updateTodos, deleteTodo };
