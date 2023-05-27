import { tm } from "@/shared/utils";
import React, { ElementRef } from "react";
import { ComponentPropsWithoutRef } from "react";

const Container = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ className, children, ...otherProps }, ref) => {
        return (
            <div className={tm("group relative", className)} ref={ref} {...otherProps}>
                {children}
            </div>
        );
    }
);

const Content = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ className, children, ...otherProps }, ref) => {
        return (
            <div
                className={tm(
                    "invisible absolute bottom-[calc(100%+0.25em)] rounded-md bg-gray-300 px-2 py-1 group-hover:visible",
                    className
                )}
                ref={ref}
                {...otherProps}>
                {children}
            </div>
        );
    }
);

Container.displayName = "TooltipContainer";
Content.displayName = "TooltipContent";

const tooltip = {
    Container,
    Content,
};

export default tooltip;
