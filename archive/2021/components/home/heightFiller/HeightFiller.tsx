import { useEffect, useState } from 'react';
import { getNScrollPages } from '../../common/misc';

// empty div that fills the page with certain height for scrolling of the webpage
export default function HeightFiller() {
    const [pages, setPages] = useState(1);

    useEffect(() => {
        setPages(getNScrollPages());
    }, []);

    return (
        <div
            style={{
                height: `${pages * 100}vh`,
                width: `100vw`,
                position: 'relative',
            }}
        />
    );
}
