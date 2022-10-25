import { useEffect, useState } from "react";
import { FavAnimeMedia } from ".";
import { isDevEnv } from "../utils/utils";
import styles from './card.module.sass';
import { fetchImageAsLocalUrl } from "./data";

const LOADING_IMAGE_PATH = '/icons/anime/Dual Ring-5s-200px.svg'
export function useSequentiallyLoadedImageURL(urls: string[]) {
    urls = urls.filter(url => url && url.trim() != '');
    
    const [imageURL, setImageURL] = useState(LOADING_IMAGE_PATH);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= urls.length) {
            return;
        }
        fetchImageAsLocalUrl(urls[index])
            .then(localUrl => setImageURL(localUrl))
            .then(() => setIndex(index+1))
            .catch(error => `failed to load image: ${urls[index]}, error=${error}`)
    }, [index, urls])
    

    return imageURL;
}

// export function useCoverImageURL(animeData: FavAnimeMedia) {
//     const [coverImageURL, setCoverImageURL] = useState<string>('/icons/anime/Dual Ring-5s-200px.svg')

//     useMemo(() => {

//         if (!animeData.coverImage) {
//             console.log('no coverimage available');
//             setCoverImageURL('#');
//         } else {
//             const fetchMediumImage = () => fetchImageAsLocalUrl(animeData.coverImage.medium)
//                 .then(localimageUrl => setCoverImageURL(localimageUrl));
        
//             const fetchLargeImage = () => fetchImageAsLocalUrl(animeData.coverImage.large)
//                 .then(localimageUrl => setCoverImageURL(localimageUrl));

//             // fetch medium size image first then fetch large size image
//             // so that user can at least see something first
//             fetchMediumImage()
//                 .catch(error => {
//                     console.log(`error while fetch medium size image: ${error}`);
//                 })
//                 .then(fetchLargeImage)
//                 .catch(error => {
//                     console.log(`error while fetch large size image: ${error}`);
//                 })
//         }
//     }, [animeData]);

//     return coverImageURL;
// }

function useRotateString(strings: string[], defaultTitle: string = 'N/A'): [string, () => void] {
    strings = strings.filter(title => title && title.trim() != '');
    if (!strings || strings.length == 0) {
        strings = [defaultTitle]
    }
    const [currString, setCurrString] = useState(strings[0]);
    const [index, setIndex] = useState(0);
    const nextString = () => setIndex(index + 1);
    useEffect(() => {
        setCurrString(strings[index % strings.length]);
    }, [index, strings])

    return [currString, nextString];
}

export function CardImage(props: {
    urls: string[],
    alt?: string,
    href?: string
}) {
    
    const imageURL = useSequentiallyLoadedImageURL(props.urls);
    const alt = props.alt || 'Cover Image';
    
    if (props.href) {
        return (
            <a href={props.href}>
                <img className={styles['image']} src={imageURL} alt={alt} />
            </a>
        )
    } else {
        return (
            <img className={styles['image']} src={imageURL} alt={alt} />
        )
    }

    return img
    // return (
    //     <div className={styles['card-image-container']}>
    //         <a href={`/anime/${pathName}`}>
    //             <img className={styles['card-image']} src={coverImageURL} alt={alt} />
    //         </a>
    //     </div>
    // )
}

export function CardTitle(props: {
    titles: string[],

}) {
    const [title, nextTitle] = useRotateString(props.titles);

    return <span className={styles['title']} onClick={nextTitle}>{title}</span>
}


// function CoverImage(props: { animeData: FavAnimeMedia }) {
    
//     const animeData = props.animeData;
//     const coverImageURL = useCoverImageURL(animeData);

//     const alt = (animeData && animeData.title) ? `Cover Image for ${animeData.title.native}` : 'Cover Image';

//     const pathName = isDevEnv() ? animeData.id : `${animeData.id}.html`

//     return (
//         <div className={styles['card-image-container']}>
//             <a href={`/anime/${pathName}`}>
//                 <img className={styles['card-image']} src={coverImageURL} alt={alt} />
//             </a>
//         </div>
//     )
// }

// function AnimeTitle(props: { animeData: FavAnimeMedia }) {
//     const animeData = props.animeData;

//     const [title, setTitle] = useState<string>('title');
//     const [index, setIndex] = useState<number>(0);
//     const nextTitle = () => setIndex(index + 1);
//     useEffect(() => {
//         const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english]: [];
//         setTitle(titles[index % titles.length])
//     }, [index, animeData])

//     if (!animeData) {
//         return <span className={styles['card-title']}>anime data not available</span>
//     }
//     if (!animeData.title) {
//         return <span className={styles['card-title']}>title not available</span>
//     }

//     return <span className={styles['card-title']} onClick={nextTitle}>{title}</span>
// }

export function Card(props: {
    titles: string[],
    imageUrls: string[],
    href?: string,
    alt?: string
}) {

    return (
        <li className={styles['card']}>
            <CardImage urls={props.imageUrls} alt={props.alt} href={props.href} />
            <CardTitle titles={props.titles}/>
        </li>
    )
}

export default function AnimeCard(props: { animeData: FavAnimeMedia }) {
    const animeData = props.animeData;
    const imageUrls = animeData.coverImage ? [animeData.coverImage.medium, animeData.coverImage.large] : [];
    const href = animeData.id ? `/anime/${animeData.id}${isDevEnv() ? '' : '.html'}` : '#';
    const titles = animeData.title ? [animeData.title.english, animeData.title.romaji, animeData.title.native] : [];
    
    return <Card imageUrls={imageUrls} titles={titles} href={href} alt={animeData.title?.english} />
}