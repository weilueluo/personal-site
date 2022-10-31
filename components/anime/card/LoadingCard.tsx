import { useMemo, useState } from "react";
import { randomIntRange } from "../../common/math";
import { mergeStyles } from "../../common/styles";

import styles from './LoadingCard.module.sass'

const nStyles = 10;

const randomIndices = Array.from(Array(nStyles)).map(() => Math.floor(Math.random() * nStyles + 1))

let index = 0;

// randomness is patterned
function randomIndex() {
    const value = randomIndices[index % randomIndices.length];
    index += 1;
    return value
}

export default function LoadingCard() {
    
    const i = useMemo(() => randomIndex(), []);

    return (
        <li className={mergeStyles(styles.card, styles[`loadingCard_${i}`])}>
            <div className={styles.imageContainer}>
                <a className={styles.link}>
                    <div className={mergeStyles(styles.image, styles.loadingImage)} />
                </a>
            </div>
        </li>
    )
}