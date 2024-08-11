"use client";

import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import React, { useState } from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import styles from "./theme-button.module.scss";
import { UnResolvedTheme } from "@/shared/theme/theme-utils";
import { useTheme } from "@/shared/theme/themes";
import { Trigger2 } from "@/components/ui/dropdown";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const SYSTEM_THEME = "system";

const THEMES: UnResolvedTheme[] = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];

const ThemeButton = React.forwardRef<React.ElementRef<"button">, BaseCompProps<"button">>(
    // eslint-disable-next-line react/prop-types
    ({ className, messages, ...otherProps }, ref) => {
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

        return (
            <button
                ref={ref}
                onClick={onClick}
                {...otherProps}
                className={tm(
                    "std-hover group flex h-7 w-fit flex-row items-center justify-around",
                    styles.button,
                    className
                )}>
                <div className={styles.iconContainer}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${iconDeg}deg)`,
                        }}>
                        <PieceContainer>
                            <BsGearWideConnected className="std-icon" />
                        </PieceContainer>
                        <PieceContainer>
                            <ImSun className="std-icon" />
                        </PieceContainer>
                        <PieceContainer>
                            <BsFillMoonStarsFill className="std-icon" />
                        </PieceContainer>
                    </div>
                </div>
                <div className={tm(styles.textContainer, "w-20 bg-std-dark")}>
                    <div
                        className={styles.pieces}
                        style={{
                            transform: `rotateX(${textDeg}deg)`,
                        }}>
                        <PieceContainer>
                            <FormattedMessage id="header.theme.system" messages={messages} />
                            <Trigger2 />
                        </PieceContainer>
                        <PieceContainer>
                            <FormattedMessage id="header.theme.dark" messages={messages} />
                            <Trigger2 />
                        </PieceContainer>
                        <PieceContainer>
                            <FormattedMessage id="header.theme.light" messages={messages} />
                            <Trigger2 />
                        </PieceContainer>
                    </div>
                </div>
            </button>
        );
    }
);

function PieceContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={tm(styles.pieceContainer, "std-bg group-hover:bg-std")}>
            <span className="flex flex-row gap-1">{children}</span>
        </div>
    );
}

ThemeButton.displayName = "ThemeButton";

export default ThemeButton;
