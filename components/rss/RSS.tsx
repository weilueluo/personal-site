import { useEffect, useReducer, useState } from 'react';
import { useEffectOnce } from 'react-use';
import styles from './RSS.module.sass';
import RSSLoader from './RSSLoader';
import UnderDevelopment from '../common/UnderDevelopment';
import Parser from 'rss-parser';

declare type RSSOption = {
    title: string;
    url: string;
    limit?: number;
}[];


declare type JsxFeeds = any[];

const rssOptions: RSSOption = [
    {
        title: 'Github',
        url: 'https://github.com/Redcxx.private.atom?token=AJNW6TLPB4JTBWMC7SLIJ6WA3EMWI',
    },
    {
        title: 'Hacker News',
        url: 'https://rsshub.app/hackernews',
    },
    {
        title: 'Pixiv Weekly',
        url: 'https://rsshub.app/pixiv/ranking/week',
    },
    {
        title: 'Steam News',
        url: 'https://store.steampowered.com/feeds/news/?l=english',
    },
    {
        title: 'Token Insight',
        url: ' https://tokeninsight.com/rss',
    },
    {
        title: 'World Economic Forum',
        url: 'https://rsshub.app/weforum/report',
    },
    {
        title: 'hanime.tv',
        url: 'https://rsshub.app/hanime/video',
    },
    {
        title: 'Wired',
        url: 'https://www.wired.com/feed',
    },
    {
        title: 'BBC',
        url: 'https://rsshub.app/abc',
    },
];

function createDefaultFeeds(): JsxFeeds {
    return new Array(rssOptions.length)
        .fill(0)
        .map((_, i) =>
            new Array(1).fill(<LoadingFeed opt={rssOptions[i]} />)
        ) as unknown as JsxFeeds;
}

export default function RSS() {
    const emptyArray = createDefaultFeeds();
    const [jsxFeeds, setJsxFeeds] = useState<JsxFeeds>(emptyArray);

    useEffect(() => {
        let newJsxFeeds = createDefaultFeeds();

        Promise.allSettled(
            rssOptions.map(async (opt, i) => {
                const limit = opt.limit || 5;
                return RSSLoader.loadURL(opt.url)
                    .then((feed) => {
                        console.log(`loaded feed ${i}: ${opt.title}`);
                        console.log(feed);
                        const newFeeds = feed2jsx(feed, limit);
                        newJsxFeeds = newJsxFeeds.map((oldFeeds, j) => {
                            return i == j ? newFeeds : oldFeeds;
                        });
                        setJsxFeeds(newJsxFeeds);
                    })
                    .catch((error) => {
                        console.log(`RSSLoader error: ${error}`);
                        newJsxFeeds = newJsxFeeds.map((oldFeeds, j) => {
                            return i == j ? (
                                <ErrorFeed opt={opt} error={error} />
                            ) : (
                                oldFeeds
                            );
                        });
                        setJsxFeeds(newJsxFeeds);
                    });
            })
        );
    }, []);

    const content = jsxFeeds.map((feeds, i) => (
        <div className={styles['feed-section']} key={i}>
            <h1
                className={styles['feed-section-title']}
                onClick={() => sectionTitleOnClick(rssOptions[i])}
            >
                {rssOptions[i].title}
            </h1>
            <ul className={styles['feed-section-ul']}>{feeds}</ul>
        </div>
    ));

    return (
        <>
            <UnderDevelopment />
            <div className={styles['feed-container']}>{content}</div>
        </>
    );
}

declare type OptionalOutput = {
    id?: string;
    author?: string;
};

function ErrorFeed({ opt, error }) {
    return (
        <li key={opt.url} className={styles['feed-li']}>
            <h3 className={styles['feed-li-title']}>{error.toString()}</h3>
            <p className={styles['feed-li-description']}>{error.stack}</p>
        </li>
    );
}

function LoadingFeed({ opt }) {
    return <li key={opt.url} className={styles['feed-li-loading']}></li>;
}

function feed2jsx(feed: Parser.Output<OptionalOutput>, limit) {
    return feed.items.slice(0, limit).map((item, i) => {
        const title = item.title;
        const author = item.creator || item.author || <Alert>n/a</Alert>;
        const publishDate = item.pubDate || <Alert>n/a</Alert>;
        const description = item.summary ||
            item.contentSnippet ||
            item.content || <Alert>n/a</Alert>;
        const key = item.guid || item.id || item.title || i;

        return (
            <li
                key={key}
                className={styles['feed-li']}
                onClick={() => onClick(item)}
                onMouseEnter={() => onMouseEnter(item)}
                onMouseLeave={() => onMouseLeave(item)}
            >
                <h3 className={styles['feed-li-title']}>{title}</h3>
                <span className={styles['feed-li-date']}>
                    date: {publishDate}
                </span>
                <br />
                <span className={styles['feed-li-author']}>
                    author: {author}
                </span>
                <p className={styles['feed-li-description']}>{description}</p>
            </li>
        );
    });
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
