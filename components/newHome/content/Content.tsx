import { useLayoutEffect, useState } from 'react';
import { getNScrollPages } from '../../home/scene/global';
import Hello from './hello/Hello';

export default function Content() {
    const [pages, setPages] = useState(1);

    useLayoutEffect(() => {
        setPages(getNScrollPages());
    }, []);

    return (
        <>
            <Hello />
            <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
        </>
    );
}
