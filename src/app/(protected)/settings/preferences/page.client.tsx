"use client";

/*------- LIBRARIES -------*/
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";

/*------- COMPONENTS -------*/
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

/*======= PAGE =======*/
export default function PreferencesSettingsClient() {
  const { resolvedTheme, setTheme } = useTheme();
  const [selected_theme, set_selected_theme] = useState<string>(
    resolvedTheme || "light"
  );

  /*------- HOOKS -------*/
  useEffect(() => {
    const theme = Cookies.get("theme");
    set_selected_theme(theme ? theme : resolvedTheme || "light");
  }, []);

  /*------- METHODS -------*/
  const handle_change = (value: string) => {
    setTheme(value);
    set_selected_theme(value);
    Cookies.set("theme", value, { expires: 365, path: "/" });
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full flex flex-col gap-y-8">
      {/* TITLE */}
      <div className="flex items-center gap-x-2 border-b pb-2">
        <h1 className="text-xl md:text-2xl font-medium">Preferences</h1>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl">
        Choose the look of MapHub. Select a single theme, or sync it with your
        system. Selections are applied immediately and saved automatically.
      </p>

      {/* THEME MODE */}
      <div className="flex flex-col gap-y-4 max-w-xs">
        <Label htmlFor="theme-mode-select" className="text-sm font-medium">
          Theme Mode
        </Label>
        <Select value={selected_theme} onValueChange={handle_change}>
          <SelectTrigger id="theme-mode-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
