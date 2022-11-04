
import styles from './Content.module.sass'

export default function Content() {
    return (
        <div className={styles.contentContainer}>
            <section className={styles.titleSection}>
                <div className={styles.header}>
                    <h2>Hello</h2>
                    {/* <span>I am Weilue</span> */}
                </div>
            </section>
        </div>
    )
}