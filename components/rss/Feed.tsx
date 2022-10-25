import { useEffect, useMemo, useState } from 'react';
import { timeSince } from '../common/misc';
import { FlatFeed } from './RSS.d';

import styles from './Feed.module.sass';

export default function Feed(props: { flatFeed: FlatFeed; i: number }) {
    const feed = props.flatFeed;

    const feedName = feed.name;
    const title = feed.title;
    const author = feed.creator || feed.author || 'n/a';
    const description =
        feed.summary || feed.contentSnippet || feed.content || 'description unavailable';
    const key = feed.uniqueKey;

    // display time string
    const [displayTime, setDisplayTime] = useState<string>('time unavailable')
    const [displayAgoTime, setDisplayAgoTime] = useState(true)
    const displayTimeOnClicked = () => setDisplayAgoTime(!displayAgoTime)
    useEffect(() => {
        if (feed.jsDate) {
            if (displayAgoTime) {
                setDisplayTime(timeSince(new Date(), feed.jsDate) + ' ago')
            } else {
                setDisplayTime(feed.jsDate.toLocaleString())
            }
        }
    }, [displayAgoTime, feed.jsDate])

    // expand collapse description
    // https://stackoverflow.com/a/47224153
    const getContentWidth = (element) => {
        var styles = getComputedStyle(element)

        return element.clientWidth
            - parseFloat(styles.paddingLeft)
            - parseFloat(styles.paddingRight)
    }
    const isOverflown = useMemo(() => (element, parent) => {
        // + 16 because the collapse/expand icon is 16px
        return getContentWidth(parent) < (getContentWidth(element) + 16);
    }, [])
    const [overflown, setOverflown] = useState(false)
    useEffect(() => {
        const description = document.getElementById(`feed-description-${props.i}`)
        const container = document.getElementById(`feed-description-container-${props.i}`)
        setOverflown(isOverflown(description, container))
    }, [isOverflown, props.i])
    const [expandActive, setExpandActive] = useState(false);
    const expandOnClick = () => setExpandActive(!expandActive);

    return (
        <li key={key} className={styles['feed']}>
            <span
                className={styles['feed-title']}
                onClick={() => titleOnClick(feed)}
            >
                {title}
            </span>

            <div className={styles['feed-info']}>
                <span className={styles['feed-type']}>{feedName}</span>
                <span className={styles['feed-date']} onClick={displayTimeOnClicked}>{displayTime}</span>
            </div>

            <span id={`feed-description-container-${props.i}`} className={`${styles['feed-more']} ${expandActive ? styles['expand-active'] : ''} ${overflown ? styles['overflown'] : ''}`} onClick={() => expandOnClick()}>
                <p id={`feed-description-${props.i}`} className={`${styles['feed-description']}`}>{description}</p>
                {overflown && expandActive && <span className={styles['feed-expand']}><img className={styles['feed-expand-img']} src='/icons/misc/angle-up-solid.svg' alt='collapse' /></span>}
                {overflown && !expandActive && <span className={styles['feed-expand']}><img className={styles['feed-expand-img']} src='/icons/misc/angle-down-solid.svg' alt='expand' /></span>}
            </span>
        </li>
    );
}

function titleOnClick(feed: FlatFeed) {
    feed.link && window.open(feed.link, '_blank');
}
