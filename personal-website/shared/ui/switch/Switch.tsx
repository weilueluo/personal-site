import { m } from "@/shared/css";

import styles from "./Switch.module.scss";

export interface SwitchProps {
    on?: boolean;
    children?: React.ReactNode;
}

export default function Switch(props: SwitchProps) {
    return (
        <div className={m(styles.switch, props.on ? styles.on : styles.off)}>{props.children}</div>
    );
}
