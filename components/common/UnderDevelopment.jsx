
import styles from "./UnderDevelopment.module.sass"
import { useState } from 'react'

export default function UnderDevelopment() {
    const [visible, setVisible] = useState(true)

    return (
        visible && <div className={styles["under-development-banner"]}>
            <span>This area is under development</span>
            <button className={styles["under-development-button"]} onClick={() => setVisible(false)}>&#10006;</button>
        </div>
    )
}