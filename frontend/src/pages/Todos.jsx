import { useEffect, useState } from "react";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import Alert from "../components/Alert";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalTodoCount, setTotalTodoCount] = useState(0);

  const limit = 6;

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [sort, setSort] = useState("newest");

  const { logout } = useAuth();

  const totalTodos = totalTodoCount;

  const completedTodos = todos.filter(
    (todo) => todo.completed,
  ).length;

  const pendingTodos = todos.filter(
    (todo) => !todo.completed,
  ).length;

  // FETCH TODOS
  const fetchTodos = async () => {
    try {
      setError("");
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status: filter,
        sort,
      });

      const data = await apiRequest(
        `/todos?${params.toString()}`,
      );

      setTodos(data.todos);

      setTotalPages(data.pagination.totalPages);

      setTotalTodoCount(data.pagination.totalTodos);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page, search, filter, sort]);

  // Reset page when searching/filtering/sorting
  useEffect(() => {
    setPage(1);
  }, [search, filter, sort]);

  // Success message timer
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // Error message timer
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // CREATE
  const createTodo = async (todoData) => {
    try {
      const data = await apiRequest("/todos", {
        method: "POST",
        body: JSON.stringify(todoData),
      });

      setSuccess("Todo created successfully");

      // Refresh current page
      await fetchTodos();

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // UPDATE
  const updateTodo = async (id, todoData) => {
    try {
      const data = await apiRequest(`/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify(todoData),
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? data.data : todo,
        ),
      );

      setSuccess("Todo updated successfully.");
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // DELETE
  const deleteTodo = async (id) => {
    try {
      setDeletingId(id);

      await apiRequest(`/todos/${id}`, {
        method: "DELETE",
      });

      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== id),
      );

      setTotalTodoCount((prev) => Math.max(prev - 1, 0));

      setSuccess("Todo deleted successfully.");

      // If current page becomes empty, go to previous page
      if (todos.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* NAVBAR */}

      <nav className="border-b border-moss/40 bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Marked
          </span>

          <button
            onClick={logout}
            className="rounded-full border border-ink/25 px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">

        {/* HEADER */}

        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            My list
          </h2>

          <p className="mt-1.5 font-body text-sm text-ink/60 sm:text-base">
            Everything you need to do, in one place.
          </p>
        </div>

        {/* SEARCH / FILTER / SORT */}

        <div className="mb-6 rounded-2xl border border-moss/50 bg-white p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

            <input
              type="text"
              placeholder="Search todos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
            >
              <option value="all">All todos</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="priority">Highest priority</option>
            </select>

          </div>
        </div>

        {/* STATISTICS */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-moss/50 bg-white p-5">
            <p className="font-body text-sm text-ink/55">
              Total
            </p>

            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {totalTodos}
            </p>
          </div>

          <div className="rounded-2xl border border-moss/50 bg-white p-5">
            <p className="font-body text-sm text-ink/55">
              Completed
            </p>

            <p className="mt-2 font-display text-3xl font-semibold text-amber-dark">
              {completedTodos}
            </p>
          </div>

          <div className="rounded-2xl border border-moss/50 bg-white p-5">
            <p className="font-body text-sm text-ink/55">
              Pending
            </p>

            <p className="mt-2 font-display text-3xl font-semibold text-ink/70">
              {pendingTodos}
            </p>
          </div>

        </div>

        {/* ALERTS */}

        <Alert
          message={success}
          type="success"
        />

        <Alert
          message={error}
          type="error"
        />

        {/* CREATE TODO */}

        <div className="mb-8 rounded-2xl border border-moss/50 bg-white p-5 sm:p-6">

          <h3 className="mb-4 font-display text-lg font-semibold text-ink sm:text-xl">
            Add a todo
          </h3>

          <TodoForm
            onTodoCreated={createTodo}
          />

        </div>

        {/* TODO LIST */}

        <TodoList
          todos={todos}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          deletingId={deletingId}
          loading={loading}
        />

        {/* PAGINATION */}

        {!loading && totalPages > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">

            <button
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              disabled={page === 1}
              className="rounded-full bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
            >
              Previous
            </button>

            <span className="font-body text-sm text-ink/70">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              disabled={page === totalPages}
              className="rounded-full bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
            >
              Next
            </button>

          </div>
        )}

      </main>
    </div>
  );
};

export default Todos;