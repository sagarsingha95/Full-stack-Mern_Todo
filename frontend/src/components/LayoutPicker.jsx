import { useAppearance } from "../context/AppearenceContext";

// Small CSS-only icons representing each layout shape. Keyed by the
// `preview` field in todoLayouts.js — no image assets needed.
const previewRenderers = {
  list: () => (
    <div className="flex w-full flex-col gap-1">
      <div className="h-2 w-full rounded bg-[var(--color-primary)]/40" />
      <div className="h-2 w-full rounded bg-[var(--color-primary)]/40" />
      <div className="h-2 w-full rounded bg-[var(--color-primary)]/40" />
    </div>
  ),
  "list-tight": () => (
    <div className="flex w-full flex-col gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-1.5 w-full rounded bg-[var(--color-primary)]/40" />
      ))}
    </div>
  ),
  "grid-2": () => (
    <div className="grid w-full grid-cols-2 gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-[var(--color-primary)]/40" />
      ))}
    </div>
  ),
  "grid-3": () => (
    <div className="grid w-full grid-cols-3 gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-3.5 rounded bg-[var(--color-primary)]/40" />
      ))}
    </div>
  ),
  kanban: () => (
    <div className="grid w-full grid-cols-2 gap-1.5">
      <div className="flex flex-col gap-1 rounded bg-[var(--color-border)]/60 p-1">
        <div className="h-2 rounded bg-[var(--color-primary)]/50" />
        <div className="h-2 rounded bg-[var(--color-primary)]/50" />
      </div>
      <div className="flex flex-col gap-1 rounded bg-[var(--color-border)]/60 p-1">
        <div className="h-2 rounded bg-[var(--color-success)]/50" />
      </div>
    </div>
  ),
  lines: () => (
    <div className="flex w-full flex-col gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-1 w-3/4 rounded bg-[var(--color-primary)]/40" />
      ))}
    </div>
  ),
  single: () => (
    <div className="h-9 w-full rounded-lg bg-[var(--color-primary)]/40" />
  ),
  rows: () => (
    <div className="flex w-full flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-2 w-full border-b border-[var(--color-border)] bg-[var(--color-primary)]/20"
        />
      ))}
    </div>
  ),
  timeline: () => (
    <div className="relative flex w-full flex-col gap-2 pl-3">
      <div className="absolute bottom-0 left-1 top-0 w-px bg-[var(--color-border)]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-2 w-3/4 rounded bg-[var(--color-primary)]/40" />
      ))}
    </div>
  ),
  center: () => (
    <div className="flex w-full justify-center">
      <div className="h-6 w-1/2 rounded-lg bg-[var(--color-primary)]/40" />
    </div>
  ),
};

const LayoutPicker = () => {
  const { todoLayout, setTodoLayout, availableLayouts } = useAppearance();

  return (
    <div
      role="group"
      aria-label="Todo layout"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {availableLayouts.map((option) => {
        const isSelected = todoLayout === option.id;
        const renderPreview = previewRenderers[option.preview];

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTodoLayout(option.id)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center rounded-2xl border bg-[var(--color-card)] p-4 text-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
              isSelected
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className="flex h-10 w-full items-center justify-center">
              {renderPreview ? renderPreview() : null}
            </div>

            <p className="mt-3 font-body text-xs font-semibold text-[var(--color-text)]">
              {option.name}
            </p>

            <p className="mt-0.5 font-body text-[11px] text-[var(--color-muted)]">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default LayoutPicker;