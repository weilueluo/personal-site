import { useContext } from 'react';
import HTMLCSSContent from './content/Content';
import HeightFiller from './heightFiller/HeightFiller';
import ThreeJsLoaderProgress from './loaderProgress/LoaderProgress';
import NavigationPanel from './navPanel/NavigationPanel';
import OptionsManager, { ExploreModeContext } from './options/OptionsManager';
import ThreeJsContent from './threejs/Threejs';

export default function HomePage() {
    return (
        <OptionsManager>
            <HomePageContent />
        </OptionsManager>
    );
}

function HomePageContent() {
    // allow to user to interact with threejs by removing the overlaying html
    const exploreMode = useContext(ExploreModeContext);
    return (
        <>
            <ThreeJsContent />
            <ThreeJsLoaderProgress />
            <NavigationPanel />
            {/* <ManualScrolls /> */}
            {!exploreMode && <HTMLCSSContent />}
            <HeightFiller />
        </>
    );
}
