export const m = (...classNames: (string | undefined | false)[]): string => {
    return classNames.filter(e => !!e).join(' ');
}