import { useState } from "react";

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
    <path
      d="M3 8.5L6.2 11.5L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Priority maps onto the existing success/warning/danger semantic
// tokens rather than brand-specific colors, so it stays meaningful
// across every theme.
const priorityStyles = {
  high: { dot: "bg-[var(--color-danger)]", label: "text-[var(--color-danger)]" },
  medium: { dot: "bg-[var(--color-warning)]", label: "text-[var(--color-warning)]" },
  low: { dot: "bg-[var(--color-muted)]", label: "text-[var(--color-muted)]" },
};

// Collapses the 10 layout ids down to the handful of render shapes
// TodoItem actually needs. Several layouts look identical at the
// item level and differ only in the container (grid vs list vs
// columns) — that difference lives in TodoList, not here.
const renderShapeFor = (variant) => {
  if (variant === "compact" || variant === "timeline") return "compact";
  if (variant === "minimal") return "minimal";
  if (variant === "dense") return "dense";
  if (variant === "focus") return "focus";
  return "full"; // comfortable, card, kanban-card
};

const TodoItem = ({ todo, onUpdate, onDelete, deletingId, variant = "comfortable" }) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [completed, setCompleted] = useState(todo.completed);

  const [priority, setPriority] = useState(todo.priority || "medium");

  const [dueDate, setDueDate] = useState(
    todo.dueDate ? todo.dueDate.split("T")[0] : "",
  );

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      await onUpdate(todo._id, {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate || null,
      });

      setEditing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleCompleted = async () => {
    const newCompleted = !completed;

    setCompleted(newCompleted);

    try {
      await onUpdate(todo._id, {
        title: todo.title,
        description: todo.description,
        completed: newCompleted,
        priority: todo.priority || "medium",
        dueDate: todo.dueDate || null,
      });
    } catch (error) {
      setCompleted(completed);
      console.log(error.message);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setCompleted(todo.completed);

    setPriority(todo.priority || "medium");

    setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");

    setEditing(false);
  };

  const priorityStyle = priorityStyles[todo.priority || "medium"];
  const shape = renderShapeFor(variant);

  const checkboxButton = (
    <button
      type="button"
      onClick={handleToggleCompleted}
      aria-label={completed ? "Mark as pending" : "Mark as done"}
      className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
        completed
          ? "border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-bg)]"
          : "border-[var(--color-border)] text-transparent hover:border-[var(--color-primary)]"
      }`}
    >
      <CheckIcon />
    </button>
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditing(true)}
        className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-body text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]"
      >
        Edit
      </button>

      <button
        disabled={deletingId === todo._id}
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this Todo?",
          );

          if (confirmed) {
            onDelete(todo._id);
          }
        }}
        className="rounded-full px-3.5 py-1.5 font-body text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deletingId === todo._id ? "Deleting..." : "Delete"}
      </button>
    </div>
  );

  if (editing) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
          />

          <label className="flex items-center gap-2 font-body text-sm text-[var(--color-muted)]">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Completed
          </label>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 font-body text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              disabled={updating}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 font-body text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MINIMAL — checkbox + title only, small actions
  // ==========================================
  if (shape === "minimal") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5">
        {checkboxButton}
        <span
          className={`flex-1 font-body text-sm ${
            completed ? "text-[var(--color-muted)] line-through" : "text-[var(--color-text)]"
          }`}
        >
          {todo.title}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="font-body text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)]"
        >
          Edit
        </button>
        <button
          disabled={deletingId === todo._id}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this Todo?")) {
              onDelete(todo._id);
            }
          }}
          className="font-body text-xs text-[var(--color-danger)] disabled:opacity-50"
        >
          {deletingId === todo._id ? "..." : "Delete"}
        </button>
      </div>
    );
  }

  // ==========================================
  // DENSE — single row, table-like
  // ==========================================
  if (shape === "dense") {
    return (
      <div className="flex items-center gap-4 bg-[var(--color-card)] px-4 py-3">
        {checkboxButton}

        <span
          className={`flex-1 font-body text-sm ${
            completed ? "text-[var(--color-muted)] line-through" : "text-[var(--color-text)]"
          }`}
        >
          {todo.title}
        </span>

        <span className={`flex items-center gap-1.5 font-body text-xs capitalize ${priorityStyle.label}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
          {todo.priority || "medium"}
        </span>

        {todo.dueDate && (
          <span
            className={`font-body text-xs ${
              isOverdue ? "font-medium text-[var(--color-danger)]" : "text-[var(--color-muted)]"
            }`}
          >
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}

        {actionButtons}
      </div>
    );
  }

  // ==========================================
  // COMPACT — condensed card, one-line meta
  // ==========================================
  if (shape === "compact") {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div className="flex items-center gap-3">
          {checkboxButton}
          <h3
            className={`flex-1 font-display text-base font-semibold ${
              completed ? "text-[var(--color-muted)] line-through" : "text-[var(--color-text)]"
            }`}
          >
            {todo.title}
          </h3>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-8">
          <span className={`flex items-center gap-1 font-body text-xs capitalize ${priorityStyle.label}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
            {todo.priority || "medium"}
          </span>

          {todo.dueDate && (
            <span
              className={`font-body text-xs ${
                isOverdue ? "font-medium text-[var(--color-danger)]" : "text-[var(--color-muted)]"
              }`}
            >
              {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-3 pl-8">{actionButtons}</div>
      </div>
    );
  }

  // ==========================================
  // FULL / FOCUS — comfortable, card, kanban-card, focus
  // ==========================================
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] ${
        shape === "focus" ? "w-full max-w-md p-8" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        {checkboxButton}

        <h3
          className={`font-display font-semibold ${shape === "focus" ? "text-2xl" : "text-lg"} ${
            completed ? "text-[var(--color-muted)] line-through" : "text-[var(--color-text)]"
          }`}
        >
          {todo.title}
        </h3>
      </div>

      {todo.description && (
        <p className="mt-2 pl-8 font-body text-sm text-[var(--color-muted)]">
          {todo.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 pl-8">
        <span className={`flex items-center gap-1.5 font-body text-xs font-medium capitalize ${priorityStyle.label}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
          {todo.priority || "medium"} priority
        </span>

        {todo.dueDate && (
          <span
            className={`font-body text-xs ${
              isOverdue ? "font-medium text-[var(--color-danger)]" : "text-[var(--color-muted)]"
            }`}
          >
            {isOverdue ? "Overdue: " : "Due "}
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}

        <span className="font-body text-xs text-[var(--color-muted)]">
          {completed ? (
            <span className="font-medium text-[var(--color-success)]">Completed</span>
          ) : (
            "Pending"
          )}
        </span>
      </div>

      <div className="mt-4 pl-8">{actionButtons}</div>
    </div>
  );
};

export default TodoItem;