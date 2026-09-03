import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/auth/loginUser", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.token);
      navigate("/todos");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto flex max-w-6xl justify-center px-6 py-16 sm:px-10 sm:py-24">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Log back in
          </h1>
          <p className="mt-2 font-body text-sm text-ink/60">
            Pick up your list where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-body text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block font-body text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-ink px-6 py-3.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-7 font-body text-sm text-ink/60">
            New here?{" "}
            <Link
              to="/register"
              className="font-medium text-ink underline decoration-amber decoration-2 underline-offset-2 hover:text-amber-dark"
            >
              Start your list
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;