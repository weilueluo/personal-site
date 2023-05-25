import { tm } from "@/shared/utils";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";

export interface SeparatorProps extends ComponentPropsWithoutRef<"div"> {
    variant?: "std" | "sm";
}

const Separator = forwardRef<React.ElementRef<"div">, SeparatorProps>(
    ({ className, variant = "std", ...otherProps }, ref) => {
        return (
            <div
                ref={ref}
                className={tm(
                    "box-border w-full border-b border-black",
                    variant === "std" && "mb-6 h-6",
                    variant === "sm" && "mb-1 h-1",
                    className
                )}
                {...otherProps}
            />
        );
    }
);
Separator.displayName = "Separator";

const VSeparator = forwardRef<React.ElementRef<"div">, SeparatorProps>(
    ({ className, variant = "std", ...otherProps }, ref) => {
        return (
            <div
                ref={ref}
                className={tm(
                    "border-r border-black h-full",
                    variant === "std" && "mr-3 w-6",
                    variant === "sm" && "mr-1 w-2",
                    className
                )}
                {...otherProps}
            />
        );
    }
);
VSeparator.displayName = "VSeparator";

export default Separator;
