import { tm } from "@/shared/utils";
import { VariantProps, cva } from "cva";
import React, { ComponentPropsWithoutRef } from "react";

const listVariant = cva("flex justify-center items-center grow flex-wrap gap-1");

export interface ListProps extends ComponentPropsWithoutRef<"ul">, VariantProps<typeof listVariant> {}

const List = React.forwardRef<React.ElementRef<"ul">, ListProps>(({ children, className, ...otherProps }, ref) => {
    return (
        <ul ref={ref} className={tm(listVariant(), className)} {...otherProps}>
            {children}
        </ul>
    );
});

List.displayName = "List";

export default List;
