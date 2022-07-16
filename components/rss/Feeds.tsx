import Feed from "./Feed";
import { sortFlatFeedsDesc } from "./Utils";
import styles from './Feeds.module.sass'
import { FlatFeed } from "./RSS.d";


export default function Feeds(props) {
    const flatFeeds = sortFlatFeedsDesc(props.flatFeeds)

    // map flat feed to jsx element
    const feedJsxs = flatFeeds.map((flatFeed: FlatFeed, i: number) => (
        <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />
    ));

    return (
        <ul className={styles['feeds-container']}>{feedJsxs}</ul>
    )
}