"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer rounded-full border border-[#5F9EA0]/30 bg-[#5F9EA0]/15 px-3 text-[#5F9EA0] transition-colors hover:bg-[#5F9EA0]/25"
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
