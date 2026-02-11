"use client";

import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import React, { useEffect, useState } from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import { UnResolvedTheme } from "@/shared/theme/theme-utils";
import { useTheme } from "@/shared/theme/themes";
import { Trigger2 } from "@/components/ui/dropdown";
import IconedText from "@/components/ui/icon-text";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const SYSTEM_THEME = "system";

const THEMES: UnResolvedTheme[] = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];

const THEME_ICONS: Record<UnResolvedTheme, React.ReactNode> = {
    system: <BsGearWideConnected className="std-icon" />,
    light: <ImSun className="std-icon" />,
    dark: <BsFillMoonStarsFill className="std-icon" />,
};

const ThemeButton = React.forwardRef<React.ElementRef<"button">, BaseCompProps<"button">>(
    // eslint-disable-next-line react/prop-types
    ({ className, messages, ...otherProps }, ref) => {
        const { unResolvedTheme, setTheme } = useTheme();

        const getNextTheme = (currTheme: UnResolvedTheme): UnResolvedTheme =>
            THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length];

        const [mounted, setMounted] = useState(false);
        useEffect(() => {
            setMounted(true);
        }, []);

        const onClick = () => {
            setTheme(getNextTheme(unResolvedTheme));
        };

        const displayTheme = mounted ? unResolvedTheme : SYSTEM_THEME;

        return (
            <button ref={ref} onClick={onClick} {...otherProps} className={tm("", className)}>
                <IconedText>
                    {THEME_ICONS[displayTheme]}
                    <FormattedMessage id={`header.theme.${displayTheme}`} messages={messages} />
                    <Trigger2 />
                </IconedText>
            </button>
        );
    }
);

ThemeButton.displayName = "ThemeButton";

export default ThemeButton;
