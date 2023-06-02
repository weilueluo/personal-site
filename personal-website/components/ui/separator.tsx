import { tm } from "@/shared/utils";
import React, { Children, ComponentPropsWithoutRef, forwardRef } from "react";

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
export default Separator;

const VSeparator = forwardRef<React.ElementRef<"div">, SeparatorProps>(
    ({ className, variant = "std", ...otherProps }, ref) => {
        return (
            <div
                ref={ref}
                className={tm(
                    "h-full border-r border-black",
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

const SeparatedList = function ({ children }: { children: React.ReactNode }) {
    const n = Children.count(children);
    return (
        <>
            {Children.map(children, (child, i) => {
                if (i !== n - 1) {
                    return (
                        <>
                            {child}
                            <Separator variant="sm" />
                        </>
                    );
                }
                return child;
            })}
        </>
    );
};
SeparatedList.displayName = "SeparatedList";

export { VSeparator, SeparatedList };
