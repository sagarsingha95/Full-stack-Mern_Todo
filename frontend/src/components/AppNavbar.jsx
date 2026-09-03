import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-moss/40 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        {/* LOGO */}
        <Link
          to="/todos"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          Marked
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* PROFILE */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-moss/10"
            >
              {user.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border border-moss/40 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-body font-semibold text-paper">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="font-body text-sm font-medium text-ink">
                  {user.name}
                </p>

                <p className="font-body text-xs text-ink/50">
                  View profile
                </p>
              </div>
            </Link>
          )}

          {/* LOGOUT */}
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-ink/25 px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;