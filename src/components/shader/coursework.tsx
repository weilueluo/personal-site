"use client";
import React, { useCallback, useState } from "react";

export type CourseworkType = "ray tracer" | "rasterization" | "path tracer";

export interface UseCoursework {
    toggleType: (type: CourseworkType) => void;
    toggleOption: (option: string) => void;
    type: CourseworkType | undefined;
    options: string[];
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TYPE_2_OPTIONS: Record<CourseworkType, string[]> = {
    "ray tracer": ["Cylinder And Plane", "Reflect And Refract", "Shadow", "Fresnel"],
    rasterization: ["Projection", "Rasterization", "Clipping", "Interpolation", "Zbuffering", "AAlias"],
    "path tracer": ["Light", "Bounce", "Throughput", "Halton", "AAlias", "Importance Sampling", "Multi-light IS"],
};

export const TYPE_2_SOLUTION: Record<string, string> = {
    "Cylinder And Plane": "SOLUTION_CYLINDER_AND_PLANE",
    "Reflect And Refract": "SOLUTION_REFLECTION_REFRACTION",
    Shadow: "SOLUTION_SHADOW",
    Fresnel: "SOLUTION_FRESNEL",

    Projection: "SOLUTION_PROJECTION",
    Rasterization: "SOLUTION_RASTERIZATION",
    Clipping: "SOLUTION_CLIPPING",
    Interpolation: "SOLUTION_INTERPOLATION",
    Zbuffering: "SOLUTION_ZBUFFERING",
    AAlias: "SOLUTION_AALIAS",

    Light: "SOLUTION_LIGHT",
    Bounce: "SOLUTION_BOUNCE",
    Throughput: "SOLUTION_THROUGHPUT",
    Halton: "SOLUTION_HALTON",
    "Importance Sampling": "SOLUTION_IS",
    "Multi-light IS": "SOLUTION_MIS",
};

const TYPE_2_DEFAULT_OPTION: Record<CourseworkType, string> = {
    "ray tracer": "",
    rasterization: "Projection",
    "path tracer": "",
};

export interface TypeAndOptions {
    type: CourseworkType | undefined;
    options: (typeof TYPE_2_OPTIONS)[CourseworkType];
}

export const CourseworkContext = React.createContext<UseCoursework>({} as UseCoursework);

export function CourseworkProvider({ children }: { children: React.ReactNode }) {
    const [typeAndOptions, setTypeAndOptions] = useState<TypeAndOptions>(getDefaultTypeAndOptions("ray tracer"));
    const [processing, setProcessing] = useState(false);

    const toggleType = useCallback(
        (type: CourseworkType) => {
            if (processing) return;
            setTypeAndOptions(prev => {
                if (prev.type === type) {
                    // toggle off
                    return getUndefinedTypeAndOptions();
                } else {
                    // toggle on
                    return getDefaultTypeAndOptions(type);
                }
            });
        },
        [processing]
    );

    const toggleOption = useCallback(
        (option: string) => {
            if (processing) return;
            setTypeAndOptions(prev => {
                if (prev.type === undefined) {
                    console.error(`No type is selected`);
                    return getUndefinedTypeAndOptions();
                }
                if (prev.options.includes(option)) {
                    // toggle off
                    const index = prev.options.indexOf(option);
                    const newOptions = prev.options.slice(0, index);
                    return { type: prev.type, options: newOptions };
                }

                return getActiveTypeAndOptions(prev.type, option);
            });
        },
        [processing]
    );

    return (
        <CourseworkContext.Provider value={{ toggleType, ...typeAndOptions, processing, setProcessing, toggleOption }}>
            {children}
        </CourseworkContext.Provider>
    );
}

export function useCoursework() {
    return React.useContext(CourseworkContext);
}

// return active options based on the active coursework and the selected option
// active options are the options that are before the selected option
// if option A occur before option B, then A is implictly active
function getActiveOptions(active: CourseworkType | undefined, selectedOption: string) {
    if (!active) {
        console.warn(`No type is selected`);
        return [];
    }
    const allowedOptions = TYPE_2_OPTIONS[active];
    const index = allowedOptions.indexOf(selectedOption);
    if (index === -1) {
        if (TYPE_2_DEFAULT_OPTION[active]) {
            return getActiveOptions(active, TYPE_2_DEFAULT_OPTION[active]);
        } else {
            return [];
        }
    } else {
        return allowedOptions.slice(0, index + 1);
    }
}

function getUndefinedTypeAndOptions(): TypeAndOptions {
    return {
        type: undefined,
        options: [],
    };
}

function getDefaultTypeAndOptions(type: CourseworkType): TypeAndOptions {
    return {
        type,
        options: getActiveOptions(type, TYPE_2_DEFAULT_OPTION[type]),
    };
}

function getActiveTypeAndOptions(type: CourseworkType, option: string): TypeAndOptions {
    return {
        type,
        options: getActiveOptions(type, option),
    };
}
