import { tm } from "@/shared/utils";
import { ComponentPropsWithoutRef } from "react";

export interface IconTextProps extends ComponentPropsWithoutRef<"span"> {
    hover?: boolean;
    active?: boolean;
}

export default function IconedText({ children, className, hover = true, active = false, ...rest }: IconTextProps) {
    return (
        <span
            className={tm(
                "std-icon-text std-pad",
                hover && "std-hover",
                active && "std-active dark:std-active-dark",
                className
            )}
            {...rest}>
            {children}
        </span>
    );
}
