import { useMemo } from "react";
import TodoItem from "./TodoItem";
import TodoSkeleton from "./TodoSkeleton";
import todoLayouts from "../config/TodoLayout";

const TodoList = ({
  todos,
  onUpdate,
  onDelete,
  deletingId,
  loading,
  layoutId = "comfortable",
}) => {
  const layout =
    todoLayouts.find((option) => option.id === layoutId) || todoLayouts[0];

  // Presentation-only derivations of the same `todos` array. These
  // never call the API and never change what onUpdate/onDelete do —
  // they only decide which todos render where.
  const pendingTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos],
  );

  const focusTodo = useMemo(
    () => pendingTodos[0] || todos[0] || null,
    [pendingTodos, todos],
  );

  const renderItem = (todo) => (
    <TodoItem
      key={todo._id}
      todo={todo}
      onUpdate={onUpdate}
      onDelete={onDelete}
      deletingId={deletingId}
      variant={layout.variant}
    />
  );

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
            Your todos
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
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center">
        <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
          Nothing here
        </h3>

        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
          Your todos
        </h3>

        <span className="font-body text-sm text-[var(--color-muted)]">
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* KANBAN — two status columns, same todos, same handlers */}
      {layout.group === "status" && (
        <div className={layout.containerClass}>
          <div>
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Pending ({pendingTodos.length})
            </p>
            <div className="flex flex-col gap-3">
              {pendingTodos.length === 0 ? (
                <p className="font-body text-sm text-[var(--color-muted)]">
                  Nothing pending.
                </p>
              ) : (
                pendingTodos.map(renderItem)
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Completed ({completedTodos.length})
            </p>
            <div className="flex flex-col gap-3">
              {completedTodos.length === 0 ? (
                <p className="font-body text-sm text-[var(--color-muted)]">
                  Nothing completed yet.
                </p>
              ) : (
                completedTodos.map(renderItem)
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOCUS — a single todo, centered */}
      {layout.group === "focus" && (
        <div className={layout.containerClass}>
          {focusTodo ? (
            renderItem(focusTodo)
          ) : (
            <p className="font-body text-sm text-[var(--color-muted)]">
              Nothing to focus on.
            </p>
          )}
        </div>
      )}

      {/* TIMELINE — vertical connector line + dot per item */}
      {layout.id === "timeline" && (
        <div className={layout.containerClass}>
          <div className="absolute bottom-0 left-[3px] top-0 w-px bg-[var(--color-border)]" />
          {todos.map((todo) => (
            <div key={todo._id} className="relative">
              <span className="absolute -left-6 top-4 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)]" />
              {renderItem(todo)}
            </div>
          ))}
        </div>
      )}

      {/* EVERYTHING ELSE — comfortable, compact, grid-2, grid-3, minimal, card, dense */}
      {layout.group === "none" && layout.id !== "timeline" && (
        <div className={layout.containerClass}>{todos.map(renderItem)}</div>
      )}
    </div>
  );
};

export default TodoList;