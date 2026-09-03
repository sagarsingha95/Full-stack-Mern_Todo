import TodoItem from "./TodoItem";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = ({
  todos,
  onUpdate,
  onDelete,
  deletingId,
  loading,
}) => {
  // Loading state
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Your Todos
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TodoSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          No Todos found
        </h3>

        <p className="text-gray-500 mt-2">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Your Todos
        </h3>

        <span className="text-sm text-gray-500">
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;