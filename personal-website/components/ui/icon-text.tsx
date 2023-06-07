import { tm } from "@/shared/utils";
import { ComponentPropsWithoutRef } from "react";

export interface IconTextProps extends ComponentPropsWithoutRef<"span"> {
    hover?: boolean;
}

export default function IconedText({ children, className, hover = true, ...rest }: IconTextProps) {
    return (
        <span className={tm("std-icon-text std-pad", hover && "std-hover", className)} {...rest}>
            {children}
        </span>
    );
}
