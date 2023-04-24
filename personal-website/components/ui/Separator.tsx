import { tm } from "@/shared/utils";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiDivergence } from "react-icons/gi";

const Separator = forwardRef<React.ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ className, ...otherProps }, ref) => {
        return (
            <div ref={ref} className={tm("px-2 py-3 box-border w-full border-b border-slate-500 -translate-y-1/2", className)} {...otherProps}>
            </div>
        );
    }
);
Separator.displayName = "Separator";

export default Separator;
