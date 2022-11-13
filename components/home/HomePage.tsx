import NavigationPanel from "./NavigationPanel";

import styles from './HomePage.module.sass'
import ThreeJsHome from "./ThreeJsHome";
import Content from "./Content";
import UnderDevelopment from "../common/UnderDevelopment";
import LoaderProgress from "./scene/LoaderProgress";


export default function HomePage() {
    return (
       <>
        <div className={styles.allContainer}>
            <div className={styles.threejsContainer}>
                <ThreeJsHome />
            </div>
            <LoaderProgress />
            <NavigationPanel />
            <Content />
        </div>
       </>
    )
}