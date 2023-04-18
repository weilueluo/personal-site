"use client";

import React from "react";
import { tm } from "@/shared/utils";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const Button = React.forwardRef<React.ElementRef<"button">, ButtonProps>(
    ({ children, className, ...otherProps }, ref) => {
        return (
            <button
                className={tm(
                    "flex h-fit w-fit flex-row items-center justify-around rounded-xl p-2 transition-[box-shadow] duration-150 hover:shadow-md hover:shadow-gray-600",
                    className
                )}
                ref={ref}
                {...otherProps}>
                {children}
            </button>
        );
    }
);

Button.displayName = "button";

export default Button;
