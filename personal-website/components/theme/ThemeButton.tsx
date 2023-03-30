"use client";

import { m } from "@/shared/css";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { useTheme } from "next-themes";
import {
    ReactNode,
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import { IoReorderFour } from "react-icons/io5";
import { useEffectOnce, useMountedState } from "react-use";
import styles from "./ThemeButton.module.scss";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const SYSTEM_THEME = "system";

const THEMES = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];
const DEFAULT_THEME = SYSTEM_THEME;

const themeToIconMap: {[theme: string]: ReactNode} = {
    [DARK_THEME]: <BsFillMoonStarsFill className={styles.icon} />,
    [LIGHT_THEME]: <ImSun className={styles.icon} />,
    [SYSTEM_THEME]: <BsGearWideConnected className={styles.icon} />,
};

export default function ThemeButton() {
    let { theme, setTheme, resolvedTheme } = useTheme();
    
    // on server render, it is undefined
    if (!theme) {
        theme = SYSTEM_THEME;
    }

    // handle the ui
    const getNextTheme = (currTheme: string) => THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length]

    const [leftActive, setLeftActive] = useState(false);
    const [leftTheme, setLeftTheme] = useState(getNextTheme(theme));
    const [rightTheme, setRightTheme] = useState(theme);
    const [leftIcon, setLeftIcon] = useState<ReactNode>(themeToIconMap[leftTheme]);
    const [rightIcon, setRightIcon] = useState<ReactNode>(themeToIconMap[rightTheme]);

    const switchTheme = (nextTheme: string) => {
        // set the hidden item to have the next theme text first before showing the ui
        if (leftActive) {
            setRightTheme(nextTheme);
            setLeftActive(false);
            setRightIcon(themeToIconMap[nextTheme]);
        } else {
            setLeftTheme(nextTheme);
            setLeftActive(true);
            setLeftIcon(themeToIconMap[nextTheme]);
        }

        // invoke animation to show the hidden item
        setTheme(nextTheme);
    };

    const onClick = () => switchTheme(getNextTheme(theme!));

    if (!useMountedState()) {
        return null; // avoid hydration errors because theme is undefined at server
    }

    return (
        <Button onClick={onClick}>
            <span className={styles.text} data-active={leftActive}>
                {leftTheme}
            </span>

            <div
                className={m(
                    styles.iconContainer,
                    leftActive ? styles.leftActive : styles.rightActive
                )}>
                <div>{leftIcon}</div>
                <div>{rightIcon}</div>
            </div>

            <span className={styles.text} data-active={!leftActive}>
                {rightTheme}
            </span>
        </Button>
    );
}
