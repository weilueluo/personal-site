"use client";

import { UnResolvedTheme, useTheme } from "@/shared/themes";
import { tm } from "@/shared/utils";
import React, { ReactNode, Suspense, useState } from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import { useMountedState } from "react-use";
import styles from "./ThemeButton.module.scss";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const SYSTEM_THEME = "system";

const THEMES: UnResolvedTheme[] = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];

const themeToIconMap: { [theme: string]: ReactNode } = {
    [DARK_THEME]: <BsFillMoonStarsFill className="icon-md" />,
    [LIGHT_THEME]: <ImSun className="icon-md" />,
    [SYSTEM_THEME]: <BsGearWideConnected className="icon-md" />,
};

const ThemeButton = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
    ({ className, ...otherProps }, ref) => {
        const { unResolvedTheme, setTheme } = useTheme();

        const getNextTheme = (currTheme: UnResolvedTheme) => THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length];


        const switchTheme = (theme: UnResolvedTheme) => {
            // invoke animation to show the hidden item
            // console.log(`ThemeButton: switchTheme(${theme})`);

            setTheme(theme);
        };

        const getInitDegByTheme = (theme: UnResolvedTheme) => {
            switch (theme) {
                case DARK_THEME:
                    return 0;
                case LIGHT_THEME:
                    return 120;
                case SYSTEM_THEME:
                    return 240;
            }
        };

        const [textDeg, setTextDeg] = useState(getInitDegByTheme(unResolvedTheme));
        const [iconDeg, setIconDeg] = useState(getInitDegByTheme(unResolvedTheme));

        const onClick = () => {
            switchTheme(getNextTheme(unResolvedTheme));
            setTextDeg(textDeg + 120);
            setIconDeg(iconDeg - 120);
        };

        if (!useMountedState()) {
            return null; // avoid hydration errors because theme is undefined at server
        }

        return (
            <button
                ref={ref}
                onClick={onClick}
                {...otherProps}
                className="flex h-8 w-fit flex-row items-center justify-around rounded-md">
                <div className={styles.iconContainer}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${iconDeg}deg)`,
                        }}>
                        <div className={styles.pieceContainer}>
                            <span><BsFillMoonStarsFill className="icon-md" /></span>
                        </div>
                        <div className={styles.pieceContainer}>
                            <span><BsGearWideConnected className="icon-md" /></span>
                        </div>
                        <div className={styles.pieceContainer}>
                            <span><ImSun className="icon-md" /></span>
                        </div>
                    </div>
                </div>
                <div className={styles.textContainer}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${textDeg}deg)`,
                        }}>
                        <div className={styles.pieceContainer}>
                            <span>Dark</span>
                        </div>
                        <div className={styles.pieceContainer}>
                            <span>Light</span>
                        </div>
                        <div className={styles.pieceContainer}>
                            <span>System</span>
                        </div>
                    </div>
                </div>
            </button>
        );
    }
);

ThemeButton.displayName = "ThemeButton";

export default ThemeButton;
