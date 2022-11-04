import NavigationPanel from "./NavigationPanel";

import styles from './HomePage.module.sass'
import ThreeJsHome from "./ThreeJsHome";
import Content from "./Content";


export default function HomePage() {
    return (
        <div className={styles.allContainer}>
            <div className={styles.threejsContainer}>
                <ThreeJsHome />
            </div>
            <NavigationPanel />
            <Content />
        </div>
    )
}