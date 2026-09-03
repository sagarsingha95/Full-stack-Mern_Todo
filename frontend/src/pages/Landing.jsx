import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const initialItems = [
  { id: 1, text: "Reply to Priya", done: true },
  { id: 2, text: "Pay electricity bill", done: true },
  { id: 3, text: "Book dentist appointment", done: false },
  { id: 4, text: "Draft Q3 notes", done: false },
];

const features = [
  {
    title: "Add",
    body: "Type it and hit enter. No category to pick, no project to file it under first.",
  },
  {
    title: "Mark",
    body: "Check it off when it's done. Everything crossed out stays that way until you say otherwise.",
  },
  {
    title: "Move on",
    body: "Filter down to what's still open, or search back through what you've already cleared.",
  },
];

const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className="h-3 w-3"
    aria-hidden="true"
  >
    <path
      d="M3 8.5L6.2 11.5L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TodoMockup = () => {
  const [items, setItems] = useState(initialItems);

  const toggle = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-sm rotate-2 rounded-2xl border border-moss/60 bg-white p-6 shadow-xl shadow-ink/5 sm:p-7">
      <div className="flex items-center justify-between border-b border-moss/40 pb-4">
        <span className="font-display text-lg font-semibold text-ink">
          Today
        </span>
        <span className="font-body text-xs text-ink/50">
          {items.filter((item) => !item.done).length} open
        </span>
      </div>

      <ul className="mt-4 space-y-3.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="group flex w-full items-center gap-3 text-left"
            >
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                  item.done
                    ? "border-amber bg-amber text-white"
                    : "border-moss text-transparent group-hover:border-ink/40"
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
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10 sm:pb-28 sm:pt-14">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="animate-rise">
              <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
                Add it. Mark it.
                <br />
                Move on.
              </h1>

              <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-ink/70">
                One list for everything you need to do today — no boards, no
                labels, no noise to dig through.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="rounded-full bg-ink px-7 py-3.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Start your list
                </Link>

                <Link
                  to="/login"
                  className="rounded-full border border-ink/25 px-7 py-3.5 font-body text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Log back in
                </Link>
              </div>
            </div>

            <div className="animate-rise [animation-delay:120ms]">
              <TodoMockup />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-moss/40">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`sm:pl-8 ${
                    index > 0 ? "sm:border-l sm:border-moss/40" : ""
                  }`}
                >
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {feature.title}
                  </h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/65">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-moss/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <p className="font-body text-sm text-ink/60">
            Marked — for people who like a good crossed-off list.
          </p>
          <p className="font-body text-sm text-ink/40">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;