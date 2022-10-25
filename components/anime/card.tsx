import { FavAnimeMedia } from ".";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import { isDevEnv } from "../common/misc";
import styles from './card.module.sass';
import { useRotateString } from "./hooks";



export function CardImage(props: {
    urls: string[],
    alt?: string,
    href?: string
}) {

    const imageURL = useSequentiallyLoadedImageURL(props.urls);
    const alt = props.alt || 'Cover Image';

    let img = <img className={styles['image']} src={imageURL} alt={alt} />

    if (props.href) {
        img = <a href={props.href}>{img}</a>
    }

    return img

}

export function CardTitle(props: {
    titles: string[],

}) {
    const [title, nextTitle] = useRotateString(props.titles);

    return <span className={styles['title']} onClick={nextTitle}>{title}</span>
}

export function Card(props: {
    titles: string[],
    imageUrls: string[],
    href?: string,
    alt?: string
}) {

    return (
        <li className={styles['card']}>
            <CardImage urls={props.imageUrls} alt={props.alt} href={props.href} />
            <CardTitle titles={props.titles} />
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