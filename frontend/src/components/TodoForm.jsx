import { useState } from "react";

const TodoForm = ({ onTodoCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    try {
      setLoading(true);

      await onTodoCreated({
        title,
        description,
        priority,
        dueDate: dueDate || null,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 font-body text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
      />

      <input
        type="text"
        placeholder="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 font-body text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[var(--color-primary)] px-5 py-3 font-body text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add todo"}
      </button>

    </form>
  );
};

export default TodoForm;