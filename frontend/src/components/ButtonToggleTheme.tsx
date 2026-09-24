import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ButtonToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Mudar para tema ${isDark ? "claro" : "escuro"}`}
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-20 shrink-0 items-center rounded-full border border-border bg-secondary-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Ícones de fundo, fixos nas pontas */}
      <Sun
        size={14}
        className={`absolute left-2 transition-colors ${
          isDark ? "text-muted-foreground" : "text-primary"
        }`}
      />
      <Moon
        size={14}
        className={`absolute right-2 transition-colors ${
          isDark ? "text-primary" : "text-muted-foreground"
        }`}
      />

      {/* Botão deslizante */}
      <span
        className={`z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 ${
          isDark ? "translate-x-12" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon size={12} className="text-primary-foreground" />
        ) : (
          <Sun size={12} className="text-primary-foreground" />
        )}
      </span>
    </button>
  );
}