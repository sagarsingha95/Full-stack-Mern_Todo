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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Adding..." : "Add Todo"}
      </button>

    </form>
  );
};

export default TodoForm;