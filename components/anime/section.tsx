
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimeMedia, SectionProps } from '.';
import styles from './anime.module.sass';
import Card from './card';

function useSortedAnimeDataList(animeDataList: AnimeMedia[]) {
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

function AnimeCards(props: {animeDataList: AnimeMedia[], expand: boolean}) {

    return (
        <ul className={`${styles['anime-list']} ${props.expand ? '' : styles['collapse']}`}>
            {props.animeDataList.map(animeData => <Card key={animeData.id} animeData={animeData} />)}
        </ul>
    )
}

function LoadingCards() {
    return (
        <span>loading ...</span>
    )
}

export default function Section(props: SectionProps) {

    const [animeDataList, setAnimeDataList] = useState([]);
    const sortedAnimeDataList = useSortedAnimeDataList(animeDataList);
    const [displayAnimeDataList, setDisplayAnimeDataList] = useState([]);

    const [loaded, setLoaded] = useState(false);

    // load data into database
    useMemo(() => {
        const animeDatabase = new Map();
        props.fetchData()
            .then(datas => {
                setLoaded(true);
                datas.forEach(data => animeDatabase[data.id] = data);
                setAnimeDataList(Object.values(animeDatabase));
            });
    }, [])

    // collapse toggle
    const [expand, setExpand] = useState(false);
    const animeListToggle = () => setExpand(!expand);
    const [toggleText, setToggleText] = useState('');
    useEffect(() => {
        setToggleText(expand ? 'collapse' : 'expand');
    }, [expand])

    useEffect(() => {
        setDisplayAnimeDataList(sortedAnimeDataList.slice());
    }, [sortedAnimeDataList, expand])



    return (
        <div className={styles['section-container']}>
            <div className={styles['section-header']}>
                <span className={styles['section-title']}>{props.title}</span>
                <span className={styles['section-toggle']} onClick={animeListToggle}>{toggleText}</span>
            </div>
            {loaded ? <AnimeCards animeDataList={displayAnimeDataList} expand={expand}/> : <LoadingCards />}
        </div>
    )

}