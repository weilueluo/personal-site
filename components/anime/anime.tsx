import { useEffect, useMemo, useState } from "react";
import { ANIME_IDS, getAnilistAnimeData } from "./data";

import styles from './anime.module.sass';
import Card from "./card";
import { runWithRetries } from "../utils/utils";
import { AnimeJsonType } from ".";
import { AdaptiveDpr } from "@react-three/drei";

const animeDatumDatabase = new Set();

export default function Anime() {

  // var variables = {
  //     id: 127230
  // };
  // const handleResponse = res => res.json();

  // const msg = useAnilistAnimeData(127230);

  const [animeCards, setAnimeCards] = useState([]);
  const [animeDatum, setAnimeDatum] = useState([])
  ANIME_IDS.forEach(id => runWithRetries(() => getAnilistAnimeData(id)
    .then(animeData => {
      animeDatumDatabase.add(animeData)
      setAnimeDatum(Array.from(animeDatumDatabase));
    })));

  // set anime cards according to data                                                  
  useEffect(() => {
    if (!animeDatum) {
      return;
    }
    const sortedAnimeDatum = animeDatum.slice().sort((a, b) => {
      const aDate = a.startDate;
      const bDate = b.startDate;

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

    setAnimeCards(sortedAnimeDatum.map(animeData => <Card key={animeData.id} animeData={animeData} />));
  }, [animeDatum])


  // collapse toggle
  const [expand, setExpand] = useState(false);
  const animeListToggle = () => setExpand(!expand);
  const [toggleText, setToggleText] = useState('');
  useEffect(() => {
    setToggleText(expand ? 'collapse' : 'expand');
  }, [expand])

  // 
  const cardsPerRow = 4; // need to be consistent with values in css
  const [cardRows, setCardRows] = useState(1);
  useEffect(() => {
    setCardRows(Math.ceil(animeDatum.length / cardsPerRow))
  }, [animeDatum])
  const cardHeight = 300; // need to be consistent with values in css
  const cardMargin = 20; // need to be consistent with values in css
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(expand ? cardHeight * cardRows + cardMargin * (cardRows - 1) : cardHeight);
  }, [expand, cardRows])


  return (
    <>
      <div className={styles['all-container']}>
        <div className={styles['anime-container']}>

          <div className={styles['anime-header']}>
            <span className={styles['anime-title']}>Liked Anime</span>
            <span className={styles['anime-list-toggle']} onClick={animeListToggle}>{toggleText}</span>
          </div>
          <ul className={styles['anime-list']} style={{ height: `${height}px` }}>
            {animeCards}
          </ul>
        </div>
      </div>
    </>
  )

}