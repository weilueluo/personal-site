"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            className={cn(
                "flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-2 py-1 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                "dark:border-std-light dark:bg-std-dark",
                className
            )}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
