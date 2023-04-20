import { tm } from "@/shared/utils";
import React from "react";
import styles from "./MultiButton.module.scss";

export interface MultiButtonProps extends React.ComponentPropsWithoutRef<"div"> {
    width?: string;
    onToggle?: (name: string) => unknown;
}

const MultiButton = React.forwardRef<React.ElementRef<"div">, MultiButtonProps>(
    ({ children, className, width, ...otherProps }, ref) => {
        return (
            <div className={tm(styles.container, width, className)} {...otherProps} ref={ref}>
                {children}
            </div>
        );
    }
);

MultiButton.displayName = "MultiButton";

export default MultiButton;
