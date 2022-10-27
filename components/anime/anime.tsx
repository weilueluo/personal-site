
import UnderDevelopment from '../common/UnderDevelopment';
import styles from './anime.module.sass';
import { fetchFavouriteAnimeData } from './data';
import AnimeSection from "./section/AnimeSection";


export default function Anime() {

  return (
    <>
      <UnderDevelopment />
      <div className={styles['all-container']}>
        <AnimeSection title='Favourites' fetchData={fetchFavouriteAnimeData} />
      </div>
    </>
  )

}