import { useEffect, useMemo, useState } from 'react';
import { FavAnimeMedia, SectionAnimeMedia } from '..';
import { mergeStyles } from '../../common/styles';
import { useSequentiallyLoadedImageURL } from '../../common/hooks';
import { isDevEnv } from '../../common/misc';
import { useRotateString } from '../hooks';
import { EMPTY_ARRAY, LOADING_IMAGE_PATH } from '../../common/constants';
import styles from './AnimeSection.module.sass'
import { DataManagement } from '../data';
import { extractCoverImageURLs } from '../data/misc';
import LoadingCard from '../card/LoadingCard';

function AnimeCard({ animeData }: { animeData: FavAnimeMedia }) {
    const [imageURL, index] = useSequentiallyLoadedImageURL(extractCoverImageURLs(animeData.coverImage));

    const titles = animeData.title ? [animeData.title.english, animeData.title.romaji, animeData.title.native] : EMPTY_ARRAY;
    const [title, nextTitle] = useRotateString(titles);

    const href = animeData.id ? `/anime/${animeData.id}${isDevEnv() ? '' : '.html'}` : undefined;
    const alt = (titles && titles[0]) || 'Anime Card Image'

    const imageStyle = mergeStyles(styles.image, index == 0 && styles.loadingImage)

    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    {/* eslint-disable-next-line */}
                    <img src={imageURL} alt={alt} className={imageStyle} />
                </a>
            </div>
            <span className={styles.title} onClick={nextTitle}>{title}</span>
        </li>
    )
}

export default function AnimeSection<T extends SectionAnimeMedia>(props: {
    dataManagementHook: () => DataManagement<T>,
    title: string
}) {

    const [animeDataList, loading, pageInfo, loadMore] = props.dataManagementHook();

    // load data into database once
    useMemo(() => {
        loadMore()
    }, []) // eslint-disable-line

    // set display anime data according to display amount
    const [displayAmount, setDisplayAmount] = useState(15);
    const toggleIncrease = () => setDisplayAmount(displayAmount + 15);
    const [displayAnimeDataList, setDisplayAnimeDataList] = useState([]);
    useEffect(() => {
        if (displayAmount > animeDataList.length && pageInfo.hasNextPage) {
            loadMore();
        } else {
            setDisplayAnimeDataList(animeDataList.slice(0, displayAmount))
        }
    }, [displayAmount, animeDataList]);  // eslint-disable-line

    // load more button
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {
        setHasMore(displayAmount < animeDataList.length || pageInfo.hasNextPage);
    }, [displayAmount, animeDataList])  // eslint-disable-line
    const buttonStyle = mergeStyles(styles.loadMoreButton, !hasMore && styles.allLoaded, loading && styles.loading);
    const [loadMoreText, setLoadMoreText] = useState('')
    useEffect(() => setLoadMoreText(loading ? 'loading' : (hasMore ? 'load more' : 'all loaded')), [loading, hasMore])
    const loadMoreButton = <button className={buttonStyle} onClick={toggleIncrease}>{loadMoreText}</button>

    // expand/collapse button
    const [expand, setExpand] = useState(false);
    const onClick = () => setExpand(!expand);
    const [displayText, setDisplayText] = useState('');
    useEffect(() => setDisplayText(expand ? 'collapse' : 'expand'), [expand]);
    const toggleExpandButton = <button className={styles.expandButton} onClick={onClick}>{displayText}</button>

    // cards
    const cards = (displayAnimeDataList && displayAnimeDataList.length > 0)
        ? displayAnimeDataList.map(animeData => <AnimeCard key={animeData.id} animeData={animeData} />)
        : Array.from(Array(10)).map((_, i) => <LoadingCard key={i} />)
    // const cards = Array.from(Array(5)).map((_, i) => <LoadingCard key={i} />)
    const cardListStyle = mergeStyles(styles.cardList, !expand && styles.collapse, styles.cardList);

    return (
        <div className={styles.sectionContainer}>
            {/* Header */}
            <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                    <span className={styles.sectionTitle}>{props.title}</span>
                </div>
                <div className={styles.headerRight}>
                    {loadMoreButton}
                    {toggleExpandButton}
                </div>
            </div>

            {/* Content */}
            <ul className={cardListStyle}>
                {cards}
            </ul>

            {/* Footer */}
            <div className={styles.sectionFooter}>
                {expand && loadMoreButton}
                {expand && toggleExpandButton}
            </div>
        </div>
    )

}