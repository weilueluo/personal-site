import { useEffect, useState } from 'react';
import { mergeStyles } from '../common/styles';
import styles from './ManualScrolls.module.sass';

export default function ManualScrolls() {
    const [scroll, setScroll] = useState(undefined);

    useEffect(() => {
        let id = undefined;
        if (scroll !== undefined) {
            const scrollAmount = scroll ? 1 : -1;
            id = setInterval(
                () => window.scrollBy({ top: scrollAmount * 2 }),
                1,
            );
        }
        return () => clearInterval(id);
    }, [scroll]);

    const scrollUp = () => setScroll(false);
    const scrollDown = () => setScroll(true);
    const scrollReset = () => setScroll(undefined);

    return (
        <>
            <div
                className={mergeStyles(
                    styles.scrollButton,
                    styles.scrollButtonUp,
                )}
                onMouseDown={scrollUp}
                onMouseUp={scrollReset}
                onTouchStart={scrollUp}
                onTouchEnd={scrollReset}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.scrollArrowImg}
                    src="/icons/misc/angle-up-solid.svg"
                    alt="arrow up"
                />
            </div>
            <div
                className={mergeStyles(
                    styles.scrollButton,
                    styles.scrollButtonDown,
                )}
                onMouseDown={scrollDown}
                onMouseUp={scrollReset}
                onTouchStart={scrollDown}
                onTouchEnd={scrollReset}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.scrollArrowImg}
                    src="/icons/misc/angle-down-solid.svg"
                    alt="arrow up"
                />
            </div>
        </>
    );
}
