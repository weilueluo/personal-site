"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "flex w-full rounded-md border border-gray-400 bg-transparent px-2 py-1 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                "dark:border-std-light dark:bg-std-dark",
                className
            )}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
