
import { useEffect, useMemo, useState } from 'react';
import { FavAnimeMedia } from '..';
import BinaryButton from '../buttons/BinaryButton';
import LoadMoreButton from '../buttons/LoadMoreButton';
import { mergeStyles } from '../../common/styles';
import { useSequentiallyLoadedImageURL } from '../../common/hooks';
import { isDevEnv } from '../../common/misc';
import { useRotateString } from '../hooks';
import { LOADING_IMAGE_PATH } from '../../common/constants';
import styles from './AnimeSection.module.sass'


function sortAnimeDataList(animeDataList: FavAnimeMedia[]) {
    const newSortedAnimeDataList = animeDataList.slice().sort((a: FavAnimeMedia, b: FavAnimeMedia) => {
        const aDate = a.startDate || { year: 0, month: 0, day: 0 };
        const bDate = b.startDate || { year: 0, month: 0, day: 0 };

        // sort by date decending order
        if (aDate.year > bDate.year) {
            return -1;
        } else if (aDate.year < bDate.year) {
            return 1;
        }

        // same year
        if (aDate.month > bDate.month) {
            return -1;
        } else if (aDate.month < bDate.month) {
            return 1;
        }

        // same month
        if (aDate.day > bDate.day) {
            return -1;
        } else if (aDate.day < bDate.day) {
            return 1;
        }

        // same day
        return 0;
    });

    return newSortedAnimeDataList
}

function useToggleAmount(initAmount: number, increment: number, decrement: number, min?: number, max?: number): [number, () => void, () => void] {

    const [displayAmount, setDisplayAmount] = useState(initAmount);
    const incrementFunction = () => {
        let newAmount = displayAmount + increment;
        if (max) {
            newAmount = Math.min(newAmount, max);
        }
        setDisplayAmount(newAmount);
    };
    const decrementFunction = () => {
        let newAmount = displayAmount - decrement;
        if (min) {
            newAmount = Math.max(newAmount, min);
        }
        setDisplayAmount(newAmount);
    };

    return [displayAmount, incrementFunction, decrementFunction]
}

function AnimeCard({ animeData }: { animeData: FavAnimeMedia }) {
    const imageURLs = animeData.coverImage ? [animeData.coverImage.medium, animeData.coverImage.large] : [];
    const imageURL = useSequentiallyLoadedImageURL(imageURLs);

    const titles = animeData.title ? [animeData.title.english, animeData.title.romaji, animeData.title.native] : [];
    const [title, nextTitle] = useRotateString(titles);

    const href = animeData.id ? `/anime/${animeData.id}${isDevEnv() ? '' : '.html'}` : 'javascript:void(0)';
    const alt = animeData.title?.english || 'Anime Card Image'


    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={imageURL} alt={alt} className={styles.image} />
                </a>
            </div>
            <span className={styles.title} onClick={nextTitle}>{title}</span>
        </li>
    )
}

function LoadingCard() {
    return (
        <li className={mergeStyles(styles.card, styles.loadingCard)}>
            <div className={styles.imageContainer}>
                <a className={styles.link}>
                    <img src={LOADING_IMAGE_PATH} alt='loading' className={styles.image} />
                </a>
            </div>
        </li>
    )
}

const INIT_DISPLAY_AMOUNT = 15;
const INCREMENT_AMOUNT = 20;

export default function AnimeSection(props: {
    fetchData: () => Promise<FavAnimeMedia[]>,
    title: string
}) {

    const [animeDataList, setAnimeDataList] = useState([]);
    const fetchData = props.fetchData;

    // load data into database once
    useMemo(() => {
        const animeDatabase = new Map();
        fetchData()
            .then(datas => {
                datas.forEach(data => animeDatabase[data.id] = data);
                setAnimeDataList(Object.values(animeDatabase));
            });
    }, [fetchData])

    // sort anime data once loaded
    const [sortedAnimeDataList, setSortedAnimeDataList] = useState([]);
    useEffect(() => {
        animeDataList && setSortedAnimeDataList(sortAnimeDataList(animeDataList));
    }, [animeDataList])

    // set display anime data according to display amount
    const [displayAmount, toggleIncrease, _toggleDecrease] = useToggleAmount(INIT_DISPLAY_AMOUNT, INCREMENT_AMOUNT, 0)
    const [displayAnimeDataList, setDisplayAnimeDataList] = useState([]);
    useEffect(() => {
        setDisplayAnimeDataList(sortedAnimeDataList.slice(0, displayAmount));
    }, [displayAmount, sortedAnimeDataList]);

    // load more button
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {
        setHasMore(displayAmount < sortedAnimeDataList.length);
    }, [displayAmount, sortedAnimeDataList])
    const loadMoreButton = <LoadMoreButton hasMore={hasMore} onClick={toggleIncrease} />

    // expand/collapse button
    const [expand, setExpand] = useState(false);
    const onClick = () => setExpand(!expand);
    const toggleExpandButton = <BinaryButton binary={expand} trueText='collapse' falseText='expand' onClick={onClick} />

    // cards
    const cards = (displayAnimeDataList && displayAnimeDataList.length > 0)
        ? displayAnimeDataList.map(animeData => <AnimeCard key={animeData.id} animeData={animeData} />)
        : <LoadingCard />
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