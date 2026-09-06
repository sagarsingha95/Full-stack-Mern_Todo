// Each layout describes how the SAME todos array should be arranged,
// and how densely each TodoItem should render. TodoList reads this
// config purely for presentation — create/update/delete/pagination
// behavior never changes based on layout.
//
// `preview` selects a small CSS-only icon in LayoutPicker (see
// previewRenderers there). `variant` is passed down to TodoItem so it
// can branch on rendering style without duplicating its own logic.

const todoLayouts = [
  {
    id: "comfortable",
    name: "Comfortable list",
    description: "Roomy single column, easy to scan.",
    variant: "comfortable",
    group: "none",
    containerClass: "flex flex-col gap-4",
    preview: "list",
  },
  {
    id: "compact",
    name: "Compact list",
    description: "Tighter spacing, more todos per screen.",
    variant: "compact",
    group: "none",
    containerClass: "flex flex-col gap-2",
    preview: "list-tight",
  },
  {
    id: "grid-2",
    name: "Two-column grid",
    description: "Balanced grid for tablets and up.",
    variant: "card",
    group: "none",
    containerClass: "grid grid-cols-1 gap-4 sm:grid-cols-2",
    preview: "grid-2",
  },
  {
    id: "grid-3",
    name: "Three-column grid",
    description: "Dense grid for wide desktop screens.",
    variant: "card",
    group: "none",
    containerClass: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
    preview: "grid-3",
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Pending and completed as side-by-side columns.",
    variant: "kanban-card",
    group: "status",
    containerClass: "grid grid-cols-1 gap-4 md:grid-cols-2",
    preview: "kanban",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Just the title and a checkbox, nothing else.",
    variant: "minimal",
    group: "none",
    containerClass: "flex flex-col gap-1",
    preview: "lines",
  },
  {
    id: "card",
    name: "Card",
    description: "Bold single-column cards with full detail.",
    variant: "card",
    group: "none",
    containerClass: "grid grid-cols-1 gap-4",
    preview: "single",
  },
  {
    id: "dense",
    name: "Dense",
    description: "Table-like rows, maximum information density.",
    variant: "dense",
    group: "none",
    containerClass: "flex flex-col divide-y divide-[var(--color-border)]",
    preview: "rows",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Ordered by due date along a vertical line.",
    variant: "timeline",
    group: "none",
    containerClass: "relative flex flex-col gap-6 pl-6",
    preview: "timeline",
  },
  {
    id: "focus",
    name: "Focus mode",
    description: "Only the next pending todo, one at a time.",
    variant: "focus",
    group: "focus",
    containerClass: "flex flex-col items-center",
    preview: "center",
  },
];

export default todoLayouts;