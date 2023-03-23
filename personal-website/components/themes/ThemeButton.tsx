"use client"

import { useTheme } from "next-themes";
import { startTransition, SyntheticEvent, useEffect, useState } from "react";
import ToggleButton from "../buttons/toggle";


export default function ThemeButton() {

    const { theme, setTheme } = useTheme();

    const [isDarkMode, setDarkMode] = useState(false);

    const switchTheme = () =>  setTheme(theme === 'dark' ? 'light' : 'dark');

    useEffect(() => startTransition(() => setDarkMode(theme === 'dark')), [theme]);

    if (!theme) {
        return null;  // avoid hydration errors because theme is undefined at server
    }

    return (
        <ToggleButton onName='dark' offName='light' width='w-12' toggle={switchTheme} on={isDarkMode} />
    )
}