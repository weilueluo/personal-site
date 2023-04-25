import { tm } from "@/shared/utils";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiDivergence } from "react-icons/gi";

const Separator = forwardRef<React.ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ className, ...otherProps }, ref) => {
        return (
            <div
                ref={ref}
                className={tm("mb-6 box-border h-6 w-full border-b border-black", className)}
                {...otherProps}></div>
        );
    }
);
Separator.displayName = "Separator";

export default Separator;
