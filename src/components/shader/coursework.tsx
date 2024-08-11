"use client";
import { get } from "http";
import React, { useCallback, useEffect, useState } from "react";

export type CouseworkType = "ray tracer" | "rasterization" | "path tracer";

export interface UseCoursework {
    active: CouseworkType;
    setActive: (type: CouseworkType) => void;
    options: string[];
    activeOptions: string[];
    selectOption: (option: string) => void;
}

export const TYPE_2_OPTIONS: Record<CouseworkType, string[]> = {
    "ray tracer": ["Cylinder And Plane", "Reflect And Refract", "Fresnel"],
    rasterization: ["Projection", "Rasterization", "Clipping", "Interpolation", "Zbuffering", "AAlias"],
    "path tracer": ["Light", "Bounce", "Throughput", "Halton", "AAlias", "Importance Sampling", "Multi-light IS"],
};

export const CourseworkContext = React.createContext<UseCoursework>({} as UseCoursework);

export function CourseworkProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<CouseworkType>("ray tracer");
    const [options, setOptions] = useState<string[]>(TYPE_2_OPTIONS[active]);
    const [activeOptions, setActiveOptions] = useState<string[]>([]);
    const selectOption = useCallback(
        (option: string) => {
            setActiveOptions(getActiveOptions(active, option));
        },
        [active]
    );

    useEffect(() => {
        setOptions(TYPE_2_OPTIONS[active]);
        setActiveOptions([]);
    }, [active]);

    return (
        <CourseworkContext.Provider value={{ active, setActive, options, activeOptions, selectOption }}>
            {" "}
            {children}{" "}
        </CourseworkContext.Provider>
    );
}

export function useCoursework() {
    return React.useContext(CourseworkContext);
}

// return active options based on the active coursework and the selected option
// active options are the options that are before the selected option
// if option A occur before option B, then A is implictly active
export function getActiveOptions(active: CouseworkType, selectedOption: string) {
    const allowedOptions = TYPE_2_OPTIONS[active];
    const index = allowedOptions.indexOf(selectedOption);
    if (index === -1) {
        throw new Error(`Invalid option ${selectedOption} for ${active}, allowed options are ${allowedOptions}`);
    }
    return allowedOptions.slice(0, index + 1);
}
