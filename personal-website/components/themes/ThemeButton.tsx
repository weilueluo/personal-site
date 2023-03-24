"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ImSun } from "react-icons/im";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useMountedState } from "react-use";
import { ToggleButton } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const [isDarkModeButton, setDarkModeButton] = useState(false);

  const switchTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => setDarkModeButton(theme === "dark"), [theme]);

  const mounted = useMountedState();
  if (!mounted) {
    return null; // avoid hydration errors because theme is undefined at server
  }

  return (
    <ToggleButton
      onName="dark"
      offName="light"
      width="w-12"
      toggle={switchTheme}
      on={isDarkModeButton}
    >
      <Switch on={!isDarkModeButton}>
        <ImSun className="h-5 w-5" />
        <BsFillMoonStarsFill className="h-5 w-5" />
      </Switch>
    </ToggleButton>
  );
}
