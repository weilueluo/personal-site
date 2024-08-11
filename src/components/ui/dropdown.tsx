"use client";

import { tm } from "@/shared/utils";
import React, { Children, ComponentPropsWithoutRef, useEffect, useState } from "react";

import Separator from "./separator";
import "@/components/ui/border.scss";
import { MdExpandMore, MdUnfoldMore } from "react-icons/md";

export interface DropdownProps extends ComponentPropsWithoutRef<"div"> {}
export interface DropdownListProps extends ComponentPropsWithoutRef<"div"> {
    variant?: "std" | "glass";
    sep?: boolean;
}

const ContainerContext = React.createContext<{ open: boolean }>({ open: false });

const Container = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
    const { children, className, ...rest } = props;

    const [open, setOpen] = useState(false);

    // if user clicked
    useEffect(() => {
        const onClick = () => {
            if (open) {
                setOpen(false);
            }
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    });

    return (
        <ContainerContext.Provider value={{ open }}>
            <div
                ref={ref}
                className={tm("relative hover:cursor-pointer", className)}
                {...rest}
                onClick={e => {
                    setOpen(!open);
                    e.stopPropagation(); // prevent global onClick from firing, it will set open back to false
                }}>
                {children}
            </div>
        </ContainerContext.Provider>
    );
});
Container.displayName = "Container";

const Dropdown = React.forwardRef<HTMLDivElement, DropdownListProps>((props, ref) => {
    const { children, sep = true, variant = "std", className, ...rest } = props;
    const nChildren = Children.count(children);

    const { open } = React.useContext(ContainerContext);

    if (!open) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={tm(
                "std-text-size absolute top-full z-10 mt-2 flex w-full min-w-max flex-col p-1",
                variant === "glass" && "borderB border border-black outline-black backdrop-blur-lg dark:bg-std-dark",
                className
            )}
            {...rest}>
            {Children.map(children, (child, i) => {
                if (sep && i !== nChildren - 1) {
                    return (
                        <>
                            {child}
                            <Separator size="sm" />
                        </>
                    );
                }
                return child;
            })}
        </div>
    );
});
Dropdown.displayName = "Dropdown";

export interface DropdownTriggerProps extends ComponentPropsWithoutRef<"div"> {
    open?: boolean; // allow this component to be use as standalone without dropdown container
}
const Trigger = React.forwardRef<HTMLDivElement, DropdownTriggerProps>(
    ({ className, children, open: openProps, ...rest }, ref) => {
        let { open } = React.useContext(ContainerContext);

        open = openProps ?? open;

        return (
            <div ref={ref} className={tm("flex flex-row items-center md:gap-1", className)} {...rest}>
                {children}
                <MdExpandMore className={tm("icon-sm transition-transform", open && "rotate-180")} />
            </div>
        );
    }
);
Trigger.displayName = "DropdownTrigger";

export interface DropdownTrigger2Props extends ComponentPropsWithoutRef<"div"> {}
const Trigger2 = React.forwardRef<HTMLDivElement, DropdownTrigger2Props>(({ className, children, ...rest }, ref) => {
    return (
        <div ref={ref} className={tm("flex flex-row items-center md:gap-1", className)} {...rest}>
            {children}
            <MdUnfoldMore className={tm("icon-sm h-full transition-transform")} />
        </div>
    );
});
Trigger2.displayName = "DropdownTrigger2";

export { Container, Dropdown, Trigger, Trigger2 };
