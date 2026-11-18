"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9 opacity-50"
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4 rounded-full border border-current opacity-40" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full text-foreground hover:bg-[#F5EFEB] dark:hover:bg-[#251B20] w-9 h-9 transition-colors border border-transparent hover:border-[#3B1F2B]/10 dark:hover:border-[#FAF7F2]/10"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#3B1F2B] transition-all hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
