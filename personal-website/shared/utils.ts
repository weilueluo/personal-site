import { twMerge } from "tailwind-merge";

export const jsonFetcher = <T>(input: RequestInfo | URL, init: RequestInit | undefined = undefined) => {
    return fetch(input, init).then(res => res.json())
}


// export function errorIfFalsy(value: any, name: string) {
//     if (!value) {
//         throw new Error(`${name} is ${typeof value}, but it should not be`);
//     }
//     return value;
// }

export function cookieToObj(cookie: string | undefined): Record<string, string> {
    if (cookie) {
        return cookie.split("; ").reduce((obj: Record<string, string>, pair) => {
            const [k, v] = pair.split("=");
            obj[k] = v;
            return obj;
        }, {});
    }

    return {};
}

export function objToCookie(obj: Record<string, string>) {
    return Object.entries(obj)
        .map(([k, v]) => k + "=" + v)
        .join("; ");
}


export const tm = (...classNames: (string | undefined | false | null | 0)[]): string => {
    return twMerge(...classNames);
};