import { Context, useContext } from "react";

export function mergeStyles(...styles: string[]) {
    return styles.filter(style => !!style).join(' ');
}

export function useContextStyle(fallbackClassName: string, styleContext: Context<string>) {
    const contextClassName = useContext(styleContext);
    return mergeStyles(fallbackClassName, contextClassName)
}

