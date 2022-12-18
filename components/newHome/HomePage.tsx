import ManualScrolls from './manualScrolls/ManualScrolls';
import NavigationPanel from './navPanel/NavigationPanel';
import LoaderProgress from './loaderProgress/LoaderProgress';
import ThreeJs from './threejs/Threejs';
import Content from './content/Content';

export default function HomePage() {
    return (
        <div>
            <ThreeJs />
            <LoaderProgress />
            <NavigationPanel />
            <ManualScrolls />
            <Content />
        </div>
    );
}
