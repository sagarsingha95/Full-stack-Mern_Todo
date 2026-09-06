import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        {/* LOGO */}
        <Link
          to="/todos"
          className="font-display text-xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Marked
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* PROFILE */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-[var(--color-surface)]"
            >
              {user.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-body font-semibold text-[var(--color-bg)]">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="font-body text-sm font-medium text-[var(--color-text)]">
                  {user.name}
                </p>

                <p className="font-body text-xs text-[var(--color-muted)]">
                  View profile
                </p>
              </div>
            </Link>
          )}

          {/* LOGOUT */}
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[var(--color-border)] px-5 py-2.5 font-body text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;