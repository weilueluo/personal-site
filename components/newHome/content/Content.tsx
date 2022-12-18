import { useLayoutEffect, useState } from 'react';
import { getNScrollPages } from '../../home/scene/global';

export default function Content() {
    const [pages, setPages] = useState(1);

    useLayoutEffect(() => {
        setPages(getNScrollPages());
    }, []);

    return <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />;
}
