
import styles from "./Switch.module.scss";

export default function Switch({ children, ...otherProps }: JSX.IntrinsicElements["div"]) {
    return (
        <div className={styles.switch} {...otherProps}>
            {children}
        </div>
    );
}
