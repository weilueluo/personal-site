import { useEffect, useState } from "react";

import styles from './LoadingCard.module.sass';

const nStyles = 50;

const randomIndices = Array.from(Array(nStyles)).map(() => Math.floor(Math.random() * nStyles + 1))

let index = 0;

// randomness is patterned
function randomLoadingCardIndex() {
    const value = randomIndices[index % randomIndices.length];
    index += 1;
    return value
}

export default function LoadingCard({ banner, scale, style }: { banner: boolean, scale: number, style: object }) {

    const [i, setI] = useState(0);
    useEffect(() => {
        setI(randomLoadingCardIndex());
    }, [])

    const rotateDeg = banner ? 180 : 90;

    return (
        <li className={styles.loadingCard} style={style}>
            <div className={styles[`rotateOne_${i}`]} style={{
                background: `linear-gradient(${rotateDeg}deg, transparent, #77777780, transparent)`,
                scale: `${scale}`,
            }}></div>
            <div className={styles[`rotateTwo_${i}`]} style={{
                background: `linear-gradient(${rotateDeg}deg, transparent, #77777780, transparent)`,
                scale: `${scale}`,
            }}></div>
            {/* <div className={mergeStyles(styles.image, styles.loadingImage)} /> */}
        </li>
    )
}

LoadingCard.defaultProps = {
    banner: false,
    scale: 3,
    style: {}
}

export const LOADING_CARDS = Array.from(Array(8)).map((_, i) => <LoadingCard key={i} />)
