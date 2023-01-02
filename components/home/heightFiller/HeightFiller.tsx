import { useContext, useEffect, useState } from 'react';
import { ExploreModeContext } from '../options/OptionsManager';
import { getNScrollPages } from '../../common/misc';

// empty div that fills the page with certain height for scrolling of the webpage
export default function HeightFiller() {
    const [pages, setPages] = useState(1);

    useEffect(() => {
        setPages(getNScrollPages());
    }, []);

    // make sure it is below canvas so that user click on
    // canvas when they try to explore canvas space
    // and make sure it is above canvas and below overlay stuff like nav panel and options ui
    const zIndex = useContext(ExploreModeContext) ? -1 : 1;

    return (
        <div
            style={{
                height: `${pages * 100}vh`,
                width: `100vw`,
                zIndex: zIndex, // only overlay content like option button, navigation panel is higher than this
                position: 'relative',
            }}
        />
    );
}
