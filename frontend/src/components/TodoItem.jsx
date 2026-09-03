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

const priorityStyles = {
  high: { dot: "bg-coral", label: "text-coral" },
  medium: { dot: "bg-amber", label: "text-amber-dark" },
  low: { dot: "bg-moss-dark", label: "text-moss-dark" },
};

const TodoItem = ({ todo, onUpdate, onDelete, deletingId }) => {
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

  return (
    <div className="rounded-2xl border border-moss/50 bg-white p-5">
      {editing ? (
        <div className="space-y-3">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-moss/60 px-3 py-2.5 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
          />

          {/* Description */}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-moss/60 px-3 py-2.5 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
          />

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-moss/60 px-3 py-2.5 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          {/* Due date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-moss/60 px-3 py-2.5 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
          />

          {/* Completed */}
          <label className="flex items-center gap-2 font-body text-sm text-ink/70">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 accent-amber"
            />
            Completed
          </label>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="rounded-full bg-ink px-4 py-2 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              disabled={updating}
              className="rounded-full border border-ink/25 px-4 py-2 font-body text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Checkbox + title */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleToggleCompleted}
              aria-label={completed ? "Mark as pending" : "Mark as done"}
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                completed
                  ? "border-amber bg-amber text-white"
                  : "border-moss text-transparent hover:border-ink/40"
              }`}
            >
              <CheckIcon />
            </button>

            <h3
              className={`font-display text-lg font-semibold ${
                completed ? "text-ink/35 line-through" : "text-ink"
              }`}
            >
              {todo.title}
            </h3>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="mt-2 pl-8 font-body text-sm text-ink/60">
              {todo.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 pl-8">
            <span
              className={`flex items-center gap-1.5 font-body text-xs font-medium capitalize ${priorityStyle.label}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
              {todo.priority || "medium"} priority
            </span>

            {todo.dueDate && (
              <span
                className={`font-body text-xs ${
                  isOverdue ? "font-medium text-coral" : "text-ink/50"
                }`}
              >
                {isOverdue ? "Overdue: " : "Due "}
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}

            <span className="font-body text-xs text-ink/50">
              {completed ? (
                <span className="font-medium text-amber-dark">Completed</span>
              ) : (
                "Pending"
              )}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2 pl-8">
            <button
              onClick={() => setEditing(true)}
              className="rounded-full border border-ink/20 px-3.5 py-1.5 font-body text-xs font-medium text-ink transition-colors hover:border-ink"
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
              className="rounded-full px-3.5 py-1.5 font-body text-xs font-medium text-coral transition-colors hover:bg-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingId === todo._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;