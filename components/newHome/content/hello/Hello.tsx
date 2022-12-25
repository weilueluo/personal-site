import { useEffect, useState } from 'react';
import { getAltScroll } from '../../../common/scroll';
import styles from './Hello.module.sass';

export default function Hello() {
    const [titleStyle, setTitleStyle] = useState({
        opacity: 1,
        transform: 'none',
        filter: `0px`,
    });

    useEffect(() => {
        const handleScroll = () => {
            const scroll = getAltScroll();
            setTitleStyle({
                opacity: 1 - 4 * scroll,
                transform: `translateZ(${scroll * 100}px)`,
                filter: `blur(${scroll * 50}px)`,
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        titleStyle.opacity > 0 && (
            <div
                className={styles.container}
                style={{
                    perspective: 75,
                }}>
                <h1 className={styles.title} style={titleStyle}>
                    Hello I am Weilue
                </h1>
            </div>
        )
    );
}
