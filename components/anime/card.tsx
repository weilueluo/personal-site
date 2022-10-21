import { useEffect, useMemo, useState } from "react"
import { AnimeMedia } from "."
import styles from './anime.module.sass'



function useCoverImageURL(animeData: AnimeMedia) {
    const [coverImageURL, setCoverImageURL] = useState<string>('')

   
    useMemo(() => {
        if (!animeData || !animeData.coverImage) {
            setCoverImageURL('');
        } else {
            const fetchImage = url => fetch(url)
                .then(res => res.blob())
                .then(imageBlob => URL.createObjectURL(imageBlob))
    
            const fetchMediumImage = () => fetchImage(animeData.coverImage.medium)
                .then(localimageUrl => setCoverImageURL(localimageUrl));
        
            const fetchLargeImage = () => fetchImage(animeData.coverImage.large)
                .then(localimageUrl => setCoverImageURL(localimageUrl));

            // fetch medium size image first then fetch large size image
            // so that user can at least see something first
            fetchMediumImage()
                .catch(error => {
                    console.log(`error while fetch medium size image: ${error}`);
                })
                .then(fetchLargeImage)
                .catch(error => {
                    console.log(`error while fetch large size image: ${error}`);
                })
        }
    }, [animeData]);

    return coverImageURL;
}

function CoverImage(props: { coverImageURL: string, animeData: AnimeMedia }) {
    const coverImageURL = props.coverImageURL;
    const animeData = props.animeData;

    const alt = (animeData && animeData.title) ? `Cover Image for ${animeData.title.native}` : 'Cover Image';
    const onClick = () => animeData && animeData.siteUrl && window.open(animeData.siteUrl, '_blank');

    return (
        <div onClick={onClick} className={styles['card-image-container']}>
            <img className={styles['card-image']} src={coverImageURL} alt={alt} />
        </div>
    )
}

function AnimeTitle(props: { animeData: AnimeMedia }) {
    const animeData = props.animeData;

    const [title, setTitle] = useState<string>('title');
    const [index, setIndex] = useState<number>(0);
    const nextTitle = () => setIndex(index + 1);
    useEffect(() => {
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english]: [];
        setTitle(titles[index % titles.length])
    }, [index])

    if (!animeData) {
        return <span className={styles['card-title']}>anime data not available</span>
    }
    if (!animeData.title) {
        return <span className={styles['card-title']}>title not available</span>
    }

    return <span className={styles['card-title']} onClick={nextTitle}>{title}</span>
}

function AnimeCard(props: { data: AnimeMedia }) {
    const animeData = props.data;

    const coverImageURL = useCoverImageURL(animeData);

    return (
        <li className={styles['anime-card']}>
            <CoverImage coverImageURL={coverImageURL} animeData={animeData} />
            <AnimeTitle animeData={animeData} />
        </li>
    )
}

export default function Card(props: { animeData: AnimeMedia }) {

    return <AnimeCard data={props.animeData} />
}