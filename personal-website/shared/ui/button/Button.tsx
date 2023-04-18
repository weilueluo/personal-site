"use client";

import styles from "./Button.module.scss";

export default function Button({ children, ...otherProps }: JSX.IntrinsicElements["button"]) {
    return (
        <button className={styles.button} {...otherProps}>
            {children}
        </button>
    );
}
