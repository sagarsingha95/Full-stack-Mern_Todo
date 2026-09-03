import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  const closeMenu = () => setIsOpen(false);

  return (
    <header className="w-full">
      <nav className="mx-auto max-w-6xl px-6 py-6 sm:px-10 sm:py-7">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="font-display text-xl font-semibold tracking-tight text-ink"
          >
            Marked
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-9 sm:flex">
            <Link
              to="/"
              className="font-body text-sm text-ink/70 transition-colors hover:text-ink"
            >
              Home
            </Link>

            <Link
              to="/login"
              className="font-body text-sm text-ink/70 transition-colors hover:text-ink"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Sign up
            </Link>
          </div>

          {/* Hamburger, mobile only */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full transition-colors hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:hidden"
          >
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-in-out ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-200 ease-in-out ${
                isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-in-out ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>

        {/* Mobile menu, smooth height animation via grid-template-rows */}
        <div
          id="mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out sm:hidden ${
            isOpen ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`flex flex-col gap-1 pb-6 pt-2 transition-opacity duration-300 ease-in-out ${
                isOpen ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 font-body text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 font-body text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="mt-2 rounded-full bg-ink px-5 py-3 text-center font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;