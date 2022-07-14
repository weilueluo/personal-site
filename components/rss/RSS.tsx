import { useEffect, useReducer, useState } from 'react';
import { useEffectOnce } from 'react-use';
import styles from './RSS.module.sass';
import UnderDevelopment from '../common/UnderDevelopment';
import Parser from 'rss-parser';
import { FeedsMap, FlatFeed, RSSOptions } from './RSS.d';
import RSSManager, { feed2flatFeeds, sortFlatFeedsDesc } from './RSSManager';
import { timeSince } from '../utils/utils';

const rssOptions: RSSOptions = new Map([
    [
        'Github',
        {
            url: 'https://github.com/Redcxx.private.atom?token=AJNW6TLPB4JTBWMC7SLIJ6WA3EMWI',
        },
    ],

    [
        'Hacker News',
        {
            url: 'https://rsshub.app/hackernews',
        },
    ],

    [
        'Pixiv Weekly',
        {
            url: 'https://rsshub.app/pixiv/ranking/week',
        },
    ],

    [
        'Steam News',
        {
            url: 'https://store.steampowered.com/feeds/news/?l=english',
        },
    ],

    [
        'Token Insight',
        {
            url: ' https://tokeninsight.com/rss',
        },
    ],

    [
        'World Economic Forum',
        {
            url: 'https://rsshub.app/weforum/report',
        },
    ],

    [
        'hanime.tv',
        {
            url: 'https://rsshub.app/hanime/video',
        },
    ],

    [
        'Wired',
        {
            url: 'https://www.wired.com/feed',
        },
    ],

    [
        'BBC',
        {
            url: 'https://rsshub.app/bbc',
        },
    ],
]);

export default function RSS() {
    const [loadedFeeds, setTotalFeeds] = useState(0);

    const [feeds, setFeeds] = useState<FeedsMap>(new Map());
    const rssManager = new RSSManager(setFeeds);
    rssManager.setOptions(rssOptions);

    const [content, setContent] = useState([]);
    useEffect(() => {

        // convert feeds from each url into single array
        const flatFeeds = [];
        const limit = 10;
        feeds.forEach((feed, name) => {
            const extras = (flatFeed: FlatFeed) => {
                const date = flatFeed.pubDate || flatFeed.isodate
                return {
                    name: name,
                    jsDate: date ? new Date(date) : null
                }
            };
            flatFeeds.push(...feed2flatFeeds(feed, extras, limit));
        });
        
        // console.log(flatFeeds);
        sortFlatFeedsDesc(flatFeeds)

        const newContent = flatFeeds.map((flatFeed, i) =>
            flatFeed2jsx(flatFeed, i)
        );
        setContent(newContent);
        setTotalFeeds(newContent.length);
    }, [feeds]);

    useEffect(() => {
        rssManager.reload();
    }, []);

    return (
        <>
            <UnderDevelopment />
            <button onClick={() => rssManager.reload()}>Refresh</button>
            <span>Loaded Feeds: {loadedFeeds}</span>
            <div className={styles['feeds-container']}>{content}</div>
        </>
    );
}

function ErrorFeed({ opt, error }) {
    return (
        <li key={opt.url} className={styles['feed-li']}>
            <h3 className={styles['feed-li-title']}>{error.toString()}</h3>
            <p className={styles['feed-li-description']}>
                {error.stack || <Alert>n/a</Alert>}
            </p>
        </li>
    );
}

function LoadingFeed({ i }) {
    return <li key={i} className={styles['feed-li-loading']}></li>;
}

function flatFeed2jsx(flatFeed: FlatFeed, i: number) {
    const feedName = flatFeed.name;
    const title = flatFeed.title;
    const author = flatFeed.creator || flatFeed.author || <Alert>n/a</Alert>;
    const description =
        flatFeed.summary ||
        flatFeed.contentSnippet ||
        flatFeed.content ||
        'n/a';
    const key = flatFeed.guid || flatFeed.id || flatFeed.title || i;

    let displayTime = "n/a"
    if (flatFeed.jsDate) {
        displayTime = timeSince(new Date(), flatFeed.jsDate) + ' ago'
    }

    return (
        <li
            key={key}
            className={styles['feed']}
            onClick={() => onClick(flatFeed)}
            onMouseEnter={() => onMouseEnter(flatFeed)}
            onMouseLeave={() => onMouseLeave(flatFeed)}
        >
            <div className={styles['feed-meta']}>
                <span className={styles['feed-type']}>{feedName}</span>
                <span className={styles['feed-date']}>{displayTime}</span>
            </div>

            {/* <span className={styles['feed-author']}>{author}</span> */}
            <span className={styles['feed-title']}>{title}</span>
            <p className={styles['feed-description']}>{description}</p>
        </li>
    );
}

function Alert(props) {
    return <span className={styles['feed-alert']}>{props.children}</span>;
}

function onMouseEnter(item: Parser.Item) {
    item.link && (document.body.style.cursor = 'pointer');
}

function onMouseLeave(item: Parser.Item) {
    item.link && (document.body.style.cursor = 'default');
}

function onClick(item: Parser.Item) {
    item.link && window.open(item.link, '_blank');
}

function sectionTitleOnClick(opt) {
    opt.url && window.open(opt.url, '_blank');
}
