import { Context, useContext } from "react";

function useStyles(...styles: string[]) {
    return styles.filter(style => !!style).join(' ');
}

export function useMergedStyles(styles: object, name: string, styleContext: Context<string>) {
    const contextStyle = useContext(styleContext);
    return useStyles(styles[name], contextStyle)
}