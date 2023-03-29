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

export default function ThemeButton() {
    const { theme: userTheme, setTheme, systemTheme } = useTheme();

    // when we use setCurrTheme, it will set the actual theme underlying, so we make it the interface for ui
    const [currTheme, setCurrTheme] = useState<string>(DEFAULT_THEME);
    useEffect(() => {
        startTransition(() => {
            if (currTheme === SYSTEM_THEME) {
                setTheme(systemTheme ?? DEFAULT_THEME);
            } else {
                setTheme(currTheme);
            }
        });
    }, [currTheme]);

    // handle the ui
    const getNextTheme = (currTheme: string) =>
        THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length];
    const themeToIconMap = useRef<{ [theme: string]: ReactNode }>({
        [DARK_THEME]: <BsFillMoonStarsFill className={styles.icon} />,
        [LIGHT_THEME]: <ImSun className={styles.icon} />,
        [SYSTEM_THEME]: <BsGearWideConnected className={styles.icon} />,
    });

    const [leftActive, setLeftActive] = useState(false);
    const [leftTheme, setLeftTheme] = useState(getNextTheme(currTheme));
    const [rightTheme, setRightTheme] = useState(currTheme);
    const [leftIcon, setLeftIcon] = useState<ReactNode>(themeToIconMap.current[leftTheme]);
    const [rightIcon, setRightIcon] = useState<ReactNode>(themeToIconMap.current[rightTheme]);

    const switchTheme = (nextTheme: string) => {
        // set the hidden item to have the next theme text first before showing the ui
        if (leftActive) {
            setRightTheme(nextTheme);
            setLeftActive(false);
            setRightIcon(themeToIconMap.current[nextTheme]);
        } else {
            setLeftTheme(nextTheme);
            setLeftActive(true);
            setLeftIcon(themeToIconMap.current[nextTheme]);
        }

        // invoke animation to show the hidden item
        setCurrTheme(nextTheme);
    };

    // set the right theme on mount, because the initial theme is from server,
    // which is definitely wrong because server does not know the theme until it reaches client

    useEffectOnce(() => switchTheme(userTheme ?? systemTheme ?? DEFAULT_THEME));

    const mounted = useMountedState();
    if (!mounted) {
        return null; // avoid hydration errors because theme is undefined at server
    }

    return (
        <Button onClick={() => switchTheme(getNextTheme(currTheme))}>
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
