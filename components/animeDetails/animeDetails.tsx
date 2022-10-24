import { HtmlContext } from "next/dist/shared/lib/html-context";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimeMedia } from "../anime";
import { useCoverImageURL } from "../anime/card";
import { fetchAnimeMedia, fetchImageAsLocalUrl } from "../anime/data";
import UnderDevelopment from "../common/UnderDevelopment";
import styles from './animeDetails.module.sass';




function BannerImage() {
    const [localImageURL, setLocalImageURL] = useState(null);

    const animeData = useContext(AnimeDataContext)

    useMemo(() => {
        if (!animeData.bannerImage) {
            setLocalImageURL(null)
            return;
        }
        fetchImageAsLocalUrl(animeData.bannerImage).then(url => setLocalImageURL(url));
    }, [animeData])


    if (localImageURL) {
        const alt = `banner image for ${animeData.title ? animeData.title.english : animeData.id}`;

        return (
            <div className={styles['banner-image-container']}>
                <img className={styles['banner-image']} src={localImageURL} alt={alt} />
            </div>
        )
    } else {
        return <></>
    }
}

function CoverImage() {

    const animeData = useContext(AnimeDataContext)
    const coverImageURL = useCoverImageURL(animeData);

    const alt = (animeData && animeData.title) ? `Cover Image for ${animeData.title.native}` : 'Cover Image';

    return (
        <div className={styles['side-image-container']}>
            <img className={styles['side-image']} src={coverImageURL} alt={alt} />
        </div>
    )
}

function SidePanel() {
    const animeData = useContext(AnimeDataContext)

    return (
        <div className={styles['side-panel']}>
            <CoverImage />
        </div>
    )
}

function AnimeTitle() {
    const animeData = useContext(AnimeDataContext)

    const [title, setTitle] = useState<string>('title');
    const [index, setIndex] = useState<number>(0);
    const nextTitle = () => setIndex(index + 1);
    useEffect(() => {
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english]: [];
        setTitle(titles[index % titles.length])
    }, [index, animeData])

    if (!animeData.title) {
        return <span className={styles['anime-title']}>title not available</span>
    }

    return <span className={styles['anime-title']} onClick={nextTitle}>{title}</span>
}

function AnimeDescription() {
    const animeData = useContext(AnimeDataContext)

    const hasDescription = !!animeData.description;

    if (hasDescription) {
        return <p className={styles['anime-description']} dangerouslySetInnerHTML={{__html: animeData.description}} />
    } else {
        return <p className={`${styles['anime-description']} ${styles['no-description-available']}`}>{'No description available'}</p>
    }
}

function MainPanel() {

    return (
        <div className={styles['main-panel']}>
            <AnimeTitle />
            <AnimeDescription />
        </div>
    )
}

function Header() {
    const animeData = useContext(AnimeDataContext)

    return (
        <div className={styles['header']}>
            <BannerImage />
        </div>
    )
}

const AnimeDataContext = createContext<AnimeMedia>({id: -1})

export default function AnimeDetails(props: { animeData: AnimeMedia }) {

    return (
        <AnimeDataContext.Provider value={props.animeData}>
            <UnderDevelopment />
            <div className={styles["all-container"]}>
                <div className={styles["content-container"]}>
                    <Header />
                    <SidePanel />
                    <MainPanel/>
                </div>
            </div>
        </AnimeDataContext.Provider>
    )

}