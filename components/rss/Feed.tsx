import { useState } from 'react';
import { timeSince } from '../utils/utils';
import { FlatFeed } from './RSS.d';

import styles from './RSS.module.sass';

export default function Feed(props: { flatFeed: FlatFeed; i: number }) {
    const feed = props.flatFeed;

    const feedName = feed.name;
    const title = feed.title;
    const author = feed.creator || feed.author || 'n/a';
    const description =
        feed.summary || feed.contentSnippet || feed.content || 'description unavailable';
    const key = feed.uniqueKey;

    let displayTime = 'time unavailable';
    if (feed.jsDate) {
        displayTime = timeSince(new Date(), feed.jsDate) + ' ago';
    }

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
                <span className={styles['feed-date']}>{displayTime}</span>
                <span className={styles['feed-expand']} onClick={() => expandOnClick()}>
                    {expandActive ? 'collapse' : 'expand'}
                </span>
            </div>

            <span className={`${styles['feed-more']} ${expandActive ? styles['expand-active'] : ''}`}>
                <p className={`${styles['feed-description']}`}>{description}</p>
            </span>
        </li>
    );
}

function titleOnClick(feed: FlatFeed) {
    feed.link && window.open(feed.link, '_blank');
}
