import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const seedItems = [
  { id: 1, text: "Add your own task below", done: false },
  { id: 2, text: "Then check this one off", done: false },
];

const features = [
  {
    number: "01",
    title: "Add",
    body: "Type it and hit enter. No category to pick, no project to file it under first.",
  },
  {
    number: "02",
    title: "Mark",
    body: "Check it off when it's done. Everything crossed out stays that way until you say otherwise.",
  },
  {
    number: "03",
    title: "Move on",
    body: "Filter down to what's still open, or search back through what you've already cleared.",
  },
];

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

// A real, working demo — the visitor's own typed task actually
// appears and can be checked off. Nothing persists.
const LiveDemo = () => {
  const [items, setItems] = useState(seedItems);
  const [draft, setDraft] = useState("");

  const toggle = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const addItem = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setItems((current) => [...current, { id: Date.now(), text, done: false }]);
    setDraft("");
  };

  return (
    <div>
      <div className="border border-ink/15 p-6 sm:p-7">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center gap-3 text-left"
              >
                <span
                  className={`flex h-5 w-5 flex-none items-center justify-center border transition-colors ${
                    item.done
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/30 text-transparent group-hover:border-ink"
                  }`}
                >
                  <CheckIcon />
                </span>
                <span
                  className={`font-body text-sm transition-colors ${
                    item.done ? "text-ink/35 line-through" : "text-ink"
                  }`}
                >
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={addItem} className="mt-5 flex gap-0 border-t border-ink/15 pt-5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add your own..."
            className="min-w-0 flex-1 border-b border-ink/25 bg-transparent px-0 py-2 font-body text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink"
          />
          <button
            type="submit"
            className="flex-none px-4 font-body text-sm font-medium text-ink transition-colors hover:text-amber-dark"
          >
            Add →
          </button>
        </form>
      </div>

      <p className="mt-3 font-body text-xs uppercase tracking-widest text-ink/40">
        Fig. 1 — try it. nothing is saved.
      </p>
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* MASTHEAD LINE */}
      <div className="border-y border-ink/15">
        <p className="mx-auto max-w-6xl px-6 py-3 font-body text-xs uppercase tracking-widest text-ink/50 sm:px-10">
          A todo list. Nothing more.
        </p>
      </div>

      {/* HERO — scale as hierarchy, one color moment */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:px-10 sm:pb-20 sm:pt-20">
        <h1 className="font-display leading-[0.95] tracking-tight text-ink">
          <span className="block text-3xl sm:text-4xl">Add it.</span>
          <span className="-ml-1 block text-7xl font-semibold text-amber sm:text-8xl lg:text-9xl">
            Mark it.
          </span>
          <span className="block text-3xl sm:text-4xl">Move on.</span>
        </h1>
      </section>

      <div className="border-t border-ink/15">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* STANDFIRST + CTA */}
          <div>
            <p className="max-w-sm font-body text-lg leading-relaxed text-ink/70">
              One list for everything you need to do today — no boards, no
              labels, no noise to dig through.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-ink px-7 py-3.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Start your list <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/login"
                className="font-body text-sm font-medium text-ink underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-amber"
              >
                Already have a list? Log back in.
              </Link>
            </div>
          </div>

          {/* SPECIMEN */}
          <div>
            <LiveDemo />
          </div>
        </div>
      </div>

      {/* NUMBERED LIST — numerals as the graphic, not icons */}
      <section className="border-t border-ink/15">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`grid grid-cols-[60px_1fr] items-baseline gap-6 border-t border-ink/15 py-8 sm:grid-cols-[100px_1fr] sm:gap-10 ${
                index === 0 ? "border-t-0 pt-0" : ""
              }`}
            >
              <span className="font-display text-4xl font-semibold text-ink/15 sm:text-6xl">
                {feature.number}
              </span>

              <div>
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {feature.title}
                </h2>
                <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-ink/60 sm:text-base">
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <p className="font-body text-sm text-ink/60">
            Marked — for people who like a good crossed-off list.
          </p>
          <p className="font-body text-xs uppercase tracking-widest text-ink/40">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;