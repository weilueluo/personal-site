import NavigationPanel from "./NavigationPanel";

import styles from './HomePage.module.sass'
import Content from "./Content";
import UnderDevelopment from "../common/UnderDevelopment";
import LoaderProgress from "./scene/LoaderProgress";
import ThreeJsHome from "./ThreeJsHome";
import { Suspense } from "react";


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