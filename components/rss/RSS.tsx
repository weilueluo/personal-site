import { useEffect, useReducer, useState } from 'react'
import { useEffectOnce } from 'react-use'
import styles from './RSS.module.sass'
import RSSLoader from './RSSLoader'
import UnderDevelopment from '../common/UnderDevelopment'
import Parser from 'rss-parser'

declare type RSSOption = {
    title: string,
    url: string,
    limit?: number
}[]

declare type JsxFeeds = {
    feeds: any[]
}[] | RSSOption

const rssOptions: RSSOption = [
    {
        title: 'Github',
        url: 'https://github.com/Redcxx.private.atom?token=AJNW6TLPB4JTBWMC7SLIJ6WA3EMWI',
    },
    {
        title: 'Hacker News',
        url: 'https://rsshub.app/hackernews'
    }
]

function stateModifier(jsxFeeds: JsxFeeds, action) {
    return jsxFeeds.map((jsxFeed, i) => {
        if (i == action.i) {
            return {
                feeds: [...(jsxFeed.feeds || []), action.feed],
                ...rssOptions[i]
            }
        } else {
            return jsxFeed
        }
    })
}

export default function RSS() {
    const emptyArray = new Array(rssOptions.length).fill(0).map(() => new Array(0).fill(0)) as unknown as JsxFeeds
    const [jsxFeeds, setJsxFeeds] = useState<JsxFeeds>(emptyArray)

    useEffect(() => {

        let newJsxFeeds = emptyArray
        
        Promise.allSettled(rssOptions.map(async (opt, i) => {
            const limit = opt.limit || 5
            return RSSLoader.loadURL(opt.url)
                .then(feed => {
                    console.log("loaded feed");
                    console.log(feed);
                    newJsxFeeds = stateModifier(newJsxFeeds, {
                        i: i,
                        feed: feed2jsx(feed, limit)
                    })
                    setJsxFeeds(newJsxFeeds)
                    // opt.setJsxFeeds([...opt.jsxFeeds, ])
                })
                .catch(error => console.log(`RSSLoader error: ${error}`))
        }))
    }, [])

    const content = jsxFeeds.map((feedsOpt, i) => (
        <div className={styles['feed-section']} key={i}>
            <h1 className={styles['feed-section-title']} onClick={() => sectionTitleOnClick(feedsOpt)}>{feedsOpt.title}</h1>
            <ul className={styles['feed-section-ul']}>{feedsOpt.feeds}</ul>
        </div>
    ))

    return (
        <>
            <UnderDevelopment/>
            {content}
            {/* <div className={styles['feed-container']}></div> */}
        </>
    )
}

declare type OptionalOutput = {
    id?: string,
    author?: string
}

function feed2jsx(feed: Parser.Output<OptionalOutput>, limit) {
    return feed.items.slice(0, limit).map((item, i) => {

        const title = item.title
        const author = item.creator || item.author || <Alert>n/a</Alert>
        const publishDate = item.pubDate || <Alert>n/a</Alert>
        const description = item.summary || item.contentSnippet || item.content || <Alert>n/a</Alert>
        const key = item.guid || item.id || item.title || i

        return (
            <li 
                key={key}
                className={styles['feed-li']} 
                onClick={() => onClick(item)}
                onMouseEnter={() => onMouseEnter(item)}
                onMouseLeave={() => onMouseLeave(item)}
            >
                <h3 className={styles['feed-li-title']}>{title}</h3>
                <span className={styles['feed-li-date']}>date: {publishDate}</span><br />
                <span className={styles['feed-li-author']}>author: {author}</span>
                <p className={styles['feed-li-description']}>{description}</p>
            </li>
        )
    })
}

function Alert(props) {
    return <span className={styles['feed-alert']}>{props.children}</span>
}

function onMouseEnter(item: Parser.Item) {
    item.link && (document.body.style.cursor = "pointer")
}

function onMouseLeave(item: Parser.Item) {
    item.link && (document.body.style.cursor = "default")
}

function onClick(item: Parser.Item) {
    item.link && window.open(item.link, '_blank')
}

function sectionTitleOnClick(opt) {
    opt.url && window.open(opt.url, '_blank')
}