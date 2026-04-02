"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activeTheme =
    theme === "system" ? (resolvedTheme ?? "light") : (theme ?? "light");
  const isDark = activeTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-[#5F9EA0]/30 bg-[#5F9EA0]/15 px-3 text-[#5F9EA0] transition-colors hover:bg-[#5F9EA0]/25"
    >
      <span className="relative size-4">
        <Sun
          className={`absolute inset-0 size-4 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}
        />
        <Moon
          className={`absolute inset-0 size-4 transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}
        />
      </span>
      <span className="text-xs">{isDark ? "Dark" : "Light"}</span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
