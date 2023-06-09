"use client";

import { useImmer } from "use-immer";

export interface CountryFilter {
    name: CountryFilterName;
}
export const COUNTRY_FILTER: CountryFilter = {
    name: "JP",
};
export type CountryFilterName = "JP" | "CN" | "ANY";
export const COUNTRY_FILTER_VALUES: CountryFilterName[] = ["JP", "CN", "ANY"];

export function useCountryFilter() {
    const [countryFilter, setCountryFilterInternal] = useImmer<CountryFilter>(COUNTRY_FILTER);
    const setCountryFilter = (country: CountryFilterName) => {
        setCountryFilterInternal(draft => {
            if (COUNTRY_FILTER_VALUES.includes(country)) {
                draft.name = country;
            } else {
                console.warn(`Invalid country filter name: ${country}`);
            }
        });
    };

    return {
        countryFilter,
        setCountryFilter,
    };
}
