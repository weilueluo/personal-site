import { tm } from "@/shared/utils";
import React, { ElementRef, ComponentPropsWithoutRef } from "react";

const LoadingItem = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ children, className, ...rest }, ref) => {
        return (
            <div ref={ref} className={tm("h-4 bg-gray-500", className)} {...rest}>
                {children}
            </div>
        );
    }
);
LoadingItem.displayName = "LoadingItem";

export default LoadingItem;
