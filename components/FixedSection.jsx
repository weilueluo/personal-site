import styles from "./FixedSection.module.css"

export default function FixedSection(props) {
    return (
        <div className={styles.FixedSection} style={{ backgroundImage: `url(${props.image})` }}>
            {props.children}
        </div>
    )
}

