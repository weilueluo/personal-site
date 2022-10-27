
import { useEffect, useMemo, useState } from 'react';
import { FavAnimeMedia } from '.';
import styles from './anime.module.sass';
import BinaryButton from './buttons/BinaryButton';
import LoadMoreButton from './buttons/LoadMoreButton';
import AnimeCard from './animeCard';
import LoadingCard_li from './card/LoadingCard';
import Card_ul from './card/CardArray';
import SectionTitle from './section/Title';


function useSortedAnimeDataList(animeDataList: FavAnimeMedia[]) {
    const [sortedAnimeDataList, setSortedAnimeDataList] = useState([]);

    // set anime cards according to data                                                  
    useEffect(() => {

        if (!animeDataList) {
            return;
        }
        const newSortedAnimeDataList = animeDataList.slice().sort((a, b) => {
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
        setSortedAnimeDataList(newSortedAnimeDataList);
    }, [animeDataList])

    return sortedAnimeDataList;
}

function AnimeCardList(props: { animeDataList: FavAnimeMedia[], expand: boolean }) {
    
    const cards = (props.animeDataList && props.animeDataList.length > 0)
                    ? props.animeDataList.map(animeData => <AnimeCard key={animeData.id} animeData={animeData} />)
                    : <LoadingCard_li />

    return (
        <Card_ul expand={props.expand}>
            {cards}
        </Card_ul>
    )
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

function useDisplayAnimeDataList(sortedAnimeDataList: FavAnimeMedia[], displayAmount: number) {

    const [displayAnimeDataList, setDisplayAnimeDataList] = useState([]);
    useEffect(() => {
        setDisplayAnimeDataList(sortedAnimeDataList.slice(0, displayAmount));
    }, [displayAmount, sortedAnimeDataList]);

    return displayAnimeDataList
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
    const sortedAnimeDataList = useSortedAnimeDataList(animeDataList);

    // set display anime data according to display amount
    const [displayAmount, toggleIncrease, _toggleDecrease] = useToggleAmount(INIT_DISPLAY_AMOUNT, INCREMENT_AMOUNT, 0)
    const displayAnimeDataList = useDisplayAnimeDataList(sortedAnimeDataList, displayAmount);

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

    return (
        <div className={styles['section-container']}>
            {/* Header */}
            <div className={styles['section-header']}>
                <div className={styles['header-left']}>
                    <SectionTitle sectionTitle={props.title} />
                </div>
                <div className={styles['header-right']}>
                    {loadMoreButton}
                    {toggleExpandButton}
                </div>
            </div>

            {/* Card list */}
            <AnimeCardList animeDataList={displayAnimeDataList} expand={expand} />

            {/* Footer */}
            <div className={styles['section-footer']}>
                {expand && loadMoreButton}
                {expand && toggleExpandButton}
            </div>
        </div>
    )

}