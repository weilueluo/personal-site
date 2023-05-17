import { tm } from "@/shared/utils";
import React, { ComponentPropsWithoutRef, useState } from "react";

import styles from "./dropdown.module.scss";

export interface DropdownProps extends ComponentPropsWithoutRef<"div"> {}
export interface DropdownButtonProps extends ComponentPropsWithoutRef<"div"> {}
export interface DropdownItemProps extends ComponentPropsWithoutRef<"div"> {}
export interface DropdownListProps extends ComponentPropsWithoutRef<"div"> {}

const Container = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
    const { children, className, ...rest } = props;

    const [open, setOpen] = useState(false);

    return (
        <div
            ref={ref}
            className={tm(styles.container, open && styles.open, "hover:cursor-pointer", className)}
            {...rest}
            onClick={() => setOpen(!open)}>
            {children}
        </div>
    );
});
Container.displayName = "Container";

const List = React.forwardRef<HTMLDivElement, DropdownListProps>((props, ref) => {
    const { children, className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={tm(styles.dropdownList, "z-10 mt-2 flex w-max flex-col rounded-md p-1", className)}
            {...rest}>
            {children}
        </div>
    );
});
List.displayName = "List";

const Item = React.forwardRef<HTMLDivElement, DropdownItemProps>((props, ref) => {
    const { children, className, ...rest } = props;

    return (
        <div ref={ref} className={tm(styles.dropdownItem, className)} {...rest}>
            {children}
        </div>
    );
});
Item.displayName = "Item";

const dropdown = {
    Container,
    Item,
    List,
};

export default dropdown;
