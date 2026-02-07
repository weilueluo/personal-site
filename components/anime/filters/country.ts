"use client";

import { useImmer } from "use-immer";
import { Clickable } from "./common";

export interface CountryFilter {
    name: CountryFilterName;
}
export type CountryFilterName = "JP" | "CN" | "ANY";
export const COUNTRY_FILTER_VALUES: CountryFilterName[] = ["JP", "CN", "ANY"];

export function useCountryFilter(): Clickable<CountryFilter, CountryFilterName> {
    const [countryFilter, setCountryFilterInternal] = useImmer<Clickable<CountryFilter, CountryFilterName>>({
        name: "JP",
        onClick: (name: CountryFilterName) => {
            setCountryFilterInternal(draft => {
                if (COUNTRY_FILTER_VALUES.includes(name)) {
                    draft.name = name;
                } else {
                    console.warn(`Invalid country filter name: ${name}`);
                }
            });
        },
    });

    return countryFilter as Clickable<CountryFilter, CountryFilterName>;
}
