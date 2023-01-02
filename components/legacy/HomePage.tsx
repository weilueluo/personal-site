import NavigationPanel from './NavigationPanel';

import Content from './Content';
import styles from './HomePage.module.sass';
import ThreeJsHome from './ThreeJsHome';
import LoaderProgress from './scene/LoaderProgress';

export default function HomePage() {
    return (
        <>
            <div className={styles.allContainer}>
                <ThreeJsHome />
                <LoaderProgress />
                <NavigationPanel />
                <Content />
                {/* <ManualScrolls /> */}
            </div>
        </>
    );
}
