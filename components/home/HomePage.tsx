import { useContext } from 'react';
import HTMLCSSContent from './content/Content';
import ThreeJsLoaderProgress from './loaderProgress/LoaderProgress';
import NavigationPanel from './navPanel/NavigationPanel';
import OptionsManager, { ExploreModeContext } from './options/OptionsManager';
import ThreeJsContent from './threejs/Threejs';
import HeightFiller from './heightFiller/HeightFiller';
import ManualScrolls from './manualScrolls/ManualScrolls';

export default function HomePage() {
    return (
        <OptionsManager>
            <HomePageContent />
        </OptionsManager>
    );
}

function HomePageContent() {
    return (
        <>
            <ThreeJsContent />
            <ThreeJsLoaderProgress />
            <NavigationPanel />
            {/* <ManualScrolls /> */}
            <HTMLCSSContent />
            <HeightFiller />
        </>
    );
}
