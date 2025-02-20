"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Fix hydration issues by preventing rendering until mounted
  const [mounted, set_mounted] = useState(false);

  useEffect(() => {
    set_mounted(true);
  }, []);

  // Avoid rendering children during server-side rendering or initial mount
  // This prevents hydration mismatch by ensuring theme rendering happens only on client
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
