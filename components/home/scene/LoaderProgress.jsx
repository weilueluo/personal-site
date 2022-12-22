import { useEffect, useState } from 'react';
import { DefaultLoadingManager } from 'three';
import { clamp } from '../../common/math';
import styles from './LoaderProgress.module.sass';

export default function LoaderProgress() {
    const [total, setTotal] = useState(1);
    const [current, setCurrent] = useState(0);
    const [, setLoadingUrl] = useState('Initializing');
    const [complete, setComplete] = useState(false);
    const [, setError] = useState(null);

    DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log(
            'Started loading file: ' +
                url +
                '.\nLoaded ' +
                itemsLoaded +
                ' of ' +
                itemsTotal +
                ' files.',
        );
        setCurrent(itemsLoaded);
        setLoadingUrl(url);
        setTotal(itemsTotal);
        setComplete(itemsLoaded == itemsTotal);
    };

    DefaultLoadingManager.onLoad = function () {
        console.log('Loading Complete!');
        setComplete(true);
    };

    DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log(
            'Loading file: ' +
                url +
                '.\nLoaded ' +
                itemsLoaded +
                ' of ' +
                itemsTotal +
                ' files.',
        );
        setCurrent(itemsLoaded);
        setLoadingUrl(url);
        setTotal(itemsTotal);
        setComplete(itemsLoaded == itemsTotal);
    };

    DefaultLoadingManager.onError = function (url) {
        console.log('There was an error loading ' + url);
        setError(url);
        setComplete(false);
    };

    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const percent = (current / (total > 0 ? total : 1e-12)) * 100 || 0;
    const vary = 6;
    useEffect(() => {
        setLeft(
            percent > 99
                ? percent
                : clamp(percent + Math.random() * vary - vary / 2, 0, 100),
        );
        setRight(
            percent > 99
                ? percent
                : clamp(percent + Math.random() * vary - vary / 2, 0, 100),
        );
    }, [percent]);

    return complete ? null : (
        <div className={styles.loader}>
            <div className={styles.loadingIcon}>
                <div
                    className={styles.loadingIconCover}
                    style={{
                        clipPath: `polygon(0% 0%, 100% 0%, 100% ${
                            100 - left
                        }%, 0% ${100 - right}%)`,
                    }}></div>
            </div>
            {/* <div className={styles.loadingText}>
                    <span>Loading {current} / {total}</span>
                    <span>{loadingUrl}</span>
                    <span>{error || ""}</span>
                </div> */}
        </div>
    );
}
