
import React from "react";
import styles from "./Switch.module.scss";
import { tm } from "@/shared/utils";


export interface SwitchProps extends React.ComponentPropsWithoutRef<"div"> {}


const Switch = React.forwardRef<React.ElementRef<"div">, SwitchProps>(
    ({ children, className, ...otherProps }, ref) => {
        return (
            <div className={tm(styles.switch, className)} ref={ref} {...otherProps}>
                {children}
            </div>
        );
    }
);

Switch.displayName = "Switch"

export default Switch;