"use client";

import { Button } from "@/shared/ui/button";
import {
    ReactNode,
    useState
} from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import { useMountedState } from "react-use";
import styles from "./ThemeButton.module.scss";
import { UnResolvedTheme, useTheme } from "@/shared/themes";
import { tm } from "@/shared/utils";

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
    let { unResolvedTheme, setTheme, nextTheme } = useTheme();
    
    const [leftActive, setLeftActive] = useState(false);
    const [leftTheme, setLeftTheme] = useState(nextTheme());
    const [rightTheme, setRightTheme] = useState(unResolvedTheme);
    const [leftIcon, setLeftIcon] = useState<ReactNode>(themeToIconMap[leftTheme]);
    const [rightIcon, setRightIcon] = useState<ReactNode>(themeToIconMap[rightTheme]);

    const switchTheme = (theme: UnResolvedTheme) => {
        // set the hidden item to have the next theme text first before showing the ui
        if (leftActive) {
            setRightTheme(theme);
            setLeftActive(false);
            setRightIcon(themeToIconMap[theme]);
        } else {
            setLeftTheme(theme);
            setLeftActive(true);
            setLeftIcon(themeToIconMap[theme]);
        }

        // invoke animation to show the hidden item
        setTheme(theme);
    };

    const onClick = () => switchTheme(nextTheme());

    if (!useMountedState()) {
        return null; // avoid hydration errors because theme is undefined at server
    }

    return (
        <Button onClick={onClick}>
            <span className={styles.text} data-active={leftActive}>
                {leftTheme}
            </span>

            <div
                className={tm(
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
