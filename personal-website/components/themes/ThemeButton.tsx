"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { ToggleButton } from "../buttons";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const [isDarkModeButton, setDarkModeButton] = useState(false);

  const switchTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => setDarkModeButton(theme === "dark"), [theme]);

  const mounted = useMountedState();
  if (!mounted) {
    return null; // avoid hydration errors because theme is undefined at server
  } else {
    return (
      <ToggleButton
        onName="dark"
        offName="light"
        width="w-12"
        toggle={switchTheme}
        on={isDarkModeButton}
      />
    );
  }
}
