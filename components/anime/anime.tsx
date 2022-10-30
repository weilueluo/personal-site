
import styles from './anime.module.sass';
import { useFavDataManagement } from './data/favourites';
import AnimeSection from "./section/AnimeSection";


export default function Anime() {

  return (
    <>
      <div className={styles['all-container']}>
        <AnimeSection title='Favourites' dataManagementHook={useFavDataManagement} />
      </div>
    </>
  )

}