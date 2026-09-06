import { useAppearance } from "../context/AppearenceContext";

const ThemePicker = () => {
  const { theme, setTheme, availableThemes } = useAppearance();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {availableThemes.map((option) => {
        const isSelected = theme === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            aria-pressed={isSelected}
            className={`rounded-2xl border bg-[var(--color-card)] p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
              isSelected
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {option.swatches.map((color, index) => (
                <span
                  key={index}
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <p className="mt-3 font-body text-sm font-semibold text-[var(--color-text)]">
              {option.name}
            </p>

            <p className="mt-0.5 font-body text-xs text-[var(--color-muted)]">
              {option.description}
            </p>

            {isSelected && (
              <span className="mt-2 inline-block font-body text-[11px] font-medium text-[var(--color-primary)]">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;