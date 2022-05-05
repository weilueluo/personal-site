
import styles from './NavHeader.module.css'

export default function NavHeader() {
    return (
        <div className={styles.NavHeader}>
            <div className={styles.NavButton}>CV</div>
            <div className={styles.NavButton}>Works</div>
            <div className={styles.NavButton}>Contact</div>
            <div className={styles.NavButton}>About</div>
        </div>
    )
} 