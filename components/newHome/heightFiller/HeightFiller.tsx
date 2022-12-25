import { useState, useLayoutEffect } from "react";
import { getNScrollPages } from "../../home/scene/global";

// empty div that fills the page with certain height for scrolling of the webpage
export default function HeightFiller() {
    const [pages, setPages] = useState(1);

    useLayoutEffect(() => {
        setPages(getNScrollPages());
    }, []);

    return (
        <div
            style={{
                height: `${pages * 100}vh`,
                width: `100vw`,
                zIndex: -99999,
                pointerEvents: 'none',
                position: "absolute",
            }}
        />
    );
}
