import { useState } from "react";
import Feed from "./Feed";
import { FlatFeed } from "./RSS.d";
import { sortFlatFeedsDesc } from "./Utils";


const INITIAL_FEEDS_LIMIT = 20
const INCREMENT = 20

export default function Feeds(props: any) {
    const flatFeeds = sortFlatFeedsDesc(props.flatFeeds)

    const [feedLimit, setFeedLimit] = useState(INITIAL_FEEDS_LIMIT)

    // map flat feed to jsx element
    const feedJsxs = flatFeeds.slice(0, feedLimit).map((flatFeed: FlatFeed, i: number) => (
        <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />
    ));

    feedJsxs.push(<LoadMore key={'load-more'} flatFeeds={flatFeeds} feedLimitState={[feedLimit, setFeedLimit]} />)

    return (
        <ul className='w-full max-w-full list-none flex flex-col items-center gap-6 p-1'>{feedJsxs}</ul>
    )
}


function LoadMore({ flatFeeds, feedLimitState }: any) {
    const [feedLimit, setFeedLimit] = feedLimitState

    const remaining = flatFeeds.length - feedLimit
    const loaded = Math.min(flatFeeds.length, feedLimit)

    const loadMoreOnClick = () => setFeedLimit(feedLimit + INCREMENT)

    if (remaining <= 0) {
        return (
            <span className='italic'>~end of all feeds~</span>
        )
    } else {
        return (
            <div className='text-center mb-5'>
                <button className=' text-base w-32' onClick={loadMoreOnClick}>{INCREMENT} more</button>
                <br />
                <span className='italic text-sm'>~Loaded {loaded}/{flatFeeds.length}~</span>
            </div>
        )
    }
}