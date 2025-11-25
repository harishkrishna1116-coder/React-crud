// ThemeToggleButton.tsx
import { useTheme } from "./themeContext";

export default function ThemeToggleButton() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-white"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
