const TodoSkeleton = () => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-5 w-5 flex-none animate-pulse rounded-full bg-[var(--color-border)]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-border)]" />
      </div>

      <div className="mt-3 space-y-2 pl-8">
        <div className="h-3 w-full animate-pulse rounded bg-[var(--color-border)]/60" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--color-border)]/60" />
      </div>

      <div className="mt-4 flex gap-3 pl-8">
        <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-border)]/60" />
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--color-border)]/60" />
      </div>

      <div className="mt-4 flex gap-2 pl-8">
        <div className="h-6 w-14 animate-pulse rounded-full bg-[var(--color-border)]/60" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--color-border)]/60" />
      </div>
    </div>
  );
};

export default TodoSkeleton;