import { useEffect, useState } from "react";

export function useRotateString(strings: string[], defaultTitle: string = 'N/A'): [string, () => void] {
    strings = strings.filter(title => title && title.trim() != '');
    if (!strings || strings.length == 0) {
        strings = [defaultTitle]
    }
    const [currString, setCurrString] = useState(strings[0]);
    const [index, setIndex] = useState(0);
    const nextString = () => setIndex(index + 1);
    useEffect(() => {
        setCurrString(strings[index % strings.length]);
    }, [index, strings])

    return [currString, nextString];
}