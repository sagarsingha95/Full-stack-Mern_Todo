import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import themes, { themeTokens } from "../config/themes";
import todoLayouts from "../config/TodoLayout";

const AppearanceContext = createContext(null);

const THEME_STORAGE_KEY = "theme";
const LAYOUT_STORAGE_KEY = "todoLayout";

const DEFAULT_THEME = "system";
const DEFAULT_LAYOUT = "comfortable";

const getSystemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// Writes a token set onto <html> as CSS custom properties, e.g.
// --color-bg, --color-text, --color-primary, etc. Anything in the
// authenticated app can consume these via Tailwind's arbitrary-value
// syntax: bg-[var(--color-bg)], text-[var(--color-text)].
const applyTokens = (tokens) => {
  const root = document.documentElement;

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

const AppearanceProvider = ({ children }) => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME,
  );

  const [todoLayout, setTodoLayoutState] = useState(
    () => localStorage.getItem(LAYOUT_STORAGE_KEY) || DEFAULT_LAYOUT,
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    getSystemPrefersDark,
  );

  // Watch the OS color-scheme preference so "system" reacts live,
  // without needing a page refresh.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemPrefersDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // The concrete theme id actually rendered. "system" resolves to
  // light/dark based on the OS preference; every other theme is used
  // as-is. `theme` itself stays "system" in storage/state so the
  // picker still shows "System" as selected.
  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return systemPrefersDark ? "dark" : "light";
    }

    return theme;
  }, [theme, systemPrefersDark]);

  useEffect(() => {
    const tokens = themeTokens[resolvedTheme] || themeTokens.light;

    applyTokens(tokens);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  const setTodoLayout = useCallback((nextLayout) => {
    setTodoLayoutState(nextLayout);
    localStorage.setItem(LAYOUT_STORAGE_KEY, nextLayout);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      todoLayout,
      setTodoLayout,
      availableThemes: themes,
      availableLayouts: todoLayouts,
    }),
    [theme, resolvedTheme, todoLayout, setTheme, setTodoLayout],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error(
      "useAppearance must be used within an AppearanceProvider",
    );
  }

  return context;
};

export default AppearanceProvider;