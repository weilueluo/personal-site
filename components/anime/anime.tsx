
import styles from './anime.module.sass';
import { useFavouritesFetching, useMediaListCurrentFetching, useMediaListPlannedFetching } from './data/hooks';
import AnimeSection from "./section/AnimeSection";


export default function Anime() {

  return (
    <>
      <div className={styles.allContainer}>
        <AnimeSection title='Favourites' segmentedDataFetching={useFavouritesFetching} />
        <AnimeSection title='WATCHING' segmentedDataFetching={useMediaListCurrentFetching} />
        <AnimeSection title='PLANNED' segmentedDataFetching={useMediaListPlannedFetching} />
      </div>
    </>
  )

}