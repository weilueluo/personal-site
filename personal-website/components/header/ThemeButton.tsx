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

const ThemeButton = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
    ({ className, ...otherProps }, ref) => {
        const { unResolvedTheme, setTheme } = useTheme();

        const getNextTheme = (currTheme: UnResolvedTheme): UnResolvedTheme =>
            THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length];

        const getDegByTheme = (theme: UnResolvedTheme) => {
            switch (theme) {
                case SYSTEM_THEME:
                    return 0;
                case LIGHT_THEME:
                    return 120;
                case DARK_THEME:
                    return 240;
            }
        };

        const [textDeg, setTextDeg] = useState(getDegByTheme(unResolvedTheme));
        const [iconDeg, setIconDeg] = useState(-getDegByTheme(unResolvedTheme));

        const onClick = () => {
            const theme = getNextTheme(unResolvedTheme);
            setTheme(theme);
            setTextDeg(getDegByTheme(theme));
            setIconDeg(-getDegByTheme(theme));
        };

        if (!useMountedState()) {
            return null; // avoid hydration errors because theme is undefined at server
        }

        return (
            <button
                ref={ref}
                onClick={onClick}
                {...otherProps}
                className={tm(
                    "group flex h-7 w-fit flex-row items-center justify-around hover:underline",
                    styles.button
                )}>
                <div className={styles.iconContainer}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${iconDeg}deg)`,
                        }}>
                        <PieceContainer>
                            <BsGearWideConnected className="icon-lg px-1" />
                        </PieceContainer>
                        <PieceContainer>
                            <ImSun className="icon-lg px-1" />
                        </PieceContainer>
                        <PieceContainer>
                            <BsFillMoonStarsFill className="icon-lg px-1" />
                        </PieceContainer>
                    </div>
                </div>
                <div className={styles.textContainer}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${textDeg}deg)`,
                        }}>
                        <PieceContainer>System</PieceContainer>
                        <PieceContainer>Dark</PieceContainer>
                        <PieceContainer>Light</PieceContainer>
                    </div>
                </div>
            </button>
        );
    }
);

function PieceContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={tm(styles.pieceContainer, "std-hover")}>
            <span className="std-hover">{children}</span>
        </div>
    );
}

ThemeButton.displayName = "ThemeButton";

export default ThemeButton;
