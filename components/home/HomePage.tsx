import NavigationPanel from "./NavigationPanel";

import styles from './HomePage.module.sass'
import Content from "./Content";
import UnderDevelopment from "../common/UnderDevelopment";
import LoaderProgress from "./scene/LoaderProgress";
import ThreeJsHome from "./ThreeJsHome";
import { Suspense } from "react";
import ManualScrolls from "./ManualScrolls";


export default function HomePage() {
    return (
       <>
        <div className={styles.allContainer}>
            <ThreeJsHome />
            <LoaderProgress />
            <NavigationPanel />
            <Content />
            <ManualScrolls />
        </div>
       </>
    )
}