import { FavAnimeMedia } from ".";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import { isDevEnv } from "../common/misc";
import Card from "./card/CardLI";
import { useRotateString } from "./hooks";


export default function AnimeCard({ animeData }: { animeData: FavAnimeMedia }) {
    const imageUrls = animeData.coverImage ? [animeData.coverImage.medium, animeData.coverImage.large] : [];
    const imageUrl = useSequentiallyLoadedImageURL(imageUrls);

    const titles = animeData.title ? [animeData.title.english, animeData.title.romaji, animeData.title.native] : [];
    const [title, nextTitle] = useRotateString(titles);

    const href = animeData.id ? `/anime/${animeData.id}${isDevEnv() ? '' : '.html'}` : 'javascript:void(0)';

    return (
        <Card
            imageUrl={imageUrl}
            cardTitle={title}
            href={href}
            alt={animeData.title?.english}
            titleProps={{
                onClick: nextTitle
            }}
        />
    )
}

