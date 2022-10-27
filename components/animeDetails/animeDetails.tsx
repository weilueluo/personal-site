import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimeCharacter, AnimeMedia, AnimeRelation } from "../anime";
import CardArray, { CardArrayStyleContext } from "../anime/card/CardArray";
import Card, { CardStyleContext, CardTitleStyleContext } from "../anime/card/CardLI";
import { fetchAnimeMedia, fetchImageAsLocalUrl } from "../anime/data";
import { useRotateString } from "../anime/hooks";
import SectionTitle from "../anime/section/Title";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import UnderDevelopment from "../common/UnderDevelopment";
import styles from './animeDetails.module.sass';


function BannerImage() {

    const animeData = useContext(AnimeDataContext)

    const imageUrl = useSequentiallyLoadedImageURL([animeData.bannerImage])

    const alt = animeData.title ? animeData.title.english : animeData.id.toString()

    return (
        <div className={styles['banner-image-container']}>
            <img className={styles['banner-image']} src={imageUrl} alt={alt} />
        </div>
    )

}


function VoiceActorName(props: { characterData: AnimeCharacter }) {
    const VAs = props.characterData.voiceActors;
    let VANames = [];
    if (VAs.length > 0) {
        const names = VAs[0].name
        VANames = [names.full, names.native, ...names.alternative]
    }
    const [vaName, nextName] = useRotateString(VANames)
    if (VAs.length > 0) {
        return (
            <>
                <strong>VA</strong><br />
                <span className={styles['character-card-voice-actor-name']} onClick={nextName}>{vaName}</span>
            </>
        )
    } else {
        return <></>
    }
}

function CharacterCard(props: { characterData: AnimeCharacter }) {
    const charData = props.characterData;
    const charNode = charData.node;

    const urls = charNode?.image ? [charData.node.image.medium, charData.node.image.large] : [];
    const url = useSequentiallyLoadedImageURL(urls);
    const alt = charNode?.name ? charNode?.name.full : 'Cahracter Image'
    const [charName, nextCharName] = useRotateString([charNode.name.full, charNode.name.native, ...charNode.name.alternative])

    const cardTitle = (
        <>
            <strong className={styles['character-role']}>{charData.role} </strong><br />
            <span className={styles['character-card-name']} onClick={nextCharName}>{charName}</span><br />
            <VoiceActorName characterData={charData} />
        </>
    )

    return (
        // <CardStyleContext.Provider value={styles.card}>
            <CardTitleStyleContext.Provider value={`${styles.cardTitle} ${styles.characterCardTitle}`}>
                <Card 
                    imageUrl={url}
                    cardTitle={cardTitle}
                    alt={alt}
                    href={charData.node.siteUrl}
                />
            </CardTitleStyleContext.Provider>
        // </CardStyleContext.Provider>
    )
    return (
        <div className={styles['character-card-container']}>
            <div className={styles['character-card-image-container']}>
                <a href={charData.node.siteUrl}>
                    <img className={styles['character-card-image']} src={url} alt={alt} />
                </a>

                {/* <CardImage urls={urls} alt={alt} href={charData.node.siteUrl}/> */}
            </div>
            <strong className={styles['character-role']}>{charData.role} </strong>
            <span className={styles['character-card-name']} onClick={nextCharName}>{charName}</span>
            <VoiceActorName characterData={charData} />
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);

    return animeData.characters ? (
        <div className={styles.characterContainer}>
            <SectionTitle sectionTitle='Characters' />
            <CardArrayStyleContext.Provider value={`${styles.cardArray} ${styles.collapse}`}>
                <CardArray expand={false}>
                    {animeData.characters.edges.map(charData => <CharacterCard key={charData.id} characterData={charData} />)}
                </CardArray>
            </CardArrayStyleContext.Provider>
        </div>
    ) : <></>
}

function Hashtag() {
    const animeData = useContext(AnimeDataContext);

    const HashTag = (props: { hashtag: string }) => {
        return <div className={styles['hashtag']}>{props.hashtag}</div>
    }

    if (!animeData.hashtag) {
        console.log('hashtag not availble');
        return <></>
    } else {
        return (
            <div className={styles['hashtag-container']}>
                {animeData.hashtag.split(' ').map(hashtag => <HashTag key={hashtag} hashtag={hashtag} />)}
            </div>
        )
    }
}

function Tags() {
    const animeData = useContext(AnimeDataContext);

    const Tag = (props: { name: string }) => {
        return <div className={styles['tag']}>{props.name}</div>
    }

    if (!animeData.tags) {
        console.log('tags not availble');
        return <></>
    } else {
        return (
            <div className={styles['tag-container']}>
                {animeData.tags.map(tag => <Tag key={tag.name} name={tag.name} />)}
            </div>
        )
    }
}

function Genres() {

    const animeData = useContext(AnimeDataContext);

    const Genre = (props: { genre: string }) => {
        return <div className={styles['genre']}>{props.genre}</div>;
    }

    if (!animeData.genres) {
        console.log('anime genres not available');
        return <></>
    } else {
        return (
            <div className={styles['genre-container']}>
                {animeData.genres.map(genre => <Genre key={genre} genre={genre} />)}
            </div>
        )
    }
}

function SidePanel() {

    const animeData = useContext(AnimeDataContext);

    const [urls, setUrls] = useState([]);
    useEffect(() => {
        animeData.coverImage && setUrls([animeData.coverImage.medium, animeData.coverImage.large])
    }, [animeData.coverImage])
    const imageUrl = useSequentiallyLoadedImageURL(urls);

    const alt = animeData.title ? animeData.title.english : 'Cover Image'
    const href = animeData.siteUrl

    return (
        <div className={styles['side-panel']}>
            <div className={styles['side-image-container']}>
                <Card imageUrl={imageUrl} alt={alt} href={href} />
            </div>
            <Genres />
            <Hashtag />
            <Tags />
        </div>
    )
}

function AnimeTitle() {
    const animeData = useContext(AnimeDataContext)

    const [title, setTitle] = useState<string>('title');
    const [index, setIndex] = useState<number>(0);
    const nextTitle = () => setIndex(index + 1);
    useEffect(() => {
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english] : [];
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
        return <p className={styles['anime-description']} dangerouslySetInnerHTML={{ __html: animeData.description }} />
    } else {
        return <p className={`${styles['anime-description']} ${styles['no-description-available']}`}>{'No description available'}</p>
    }
}

function Relation(props: { relationData: AnimeRelation }) {
    const relationData = props.relationData;

    const titles = relationData.node.title;
    const coverImages = relationData.node.coverImage;

    const relationUrl = useSequentiallyLoadedImageURL(coverImages && [coverImages.medium, coverImages.large]);
    const [title, nextTitle] = useRotateString([titles.english, titles.native, titles.romaji])

    const titleJsx = (
        <>
            <strong className={styles['relation-type']}>{relationData.relationType} </strong><br />
            <span className={styles['relation-title']} onClick={nextTitle}>{title}</span>
        </>
    )

    return (
        <CardTitleStyleContext.Provider value={styles.cardTitle}>
            <Card 
                imageUrl={relationUrl}
                cardTitle={titleJsx} 
                titleProps={{onClick: nextTitle}} 
                href={relationData.node.siteUrl}
            />
        </CardTitleStyleContext.Provider>
    )
}

function Relations() {
    const animeData = useContext(AnimeDataContext)
    return animeData.relations ? (
        <div className={styles.relationContainer}>
            <SectionTitle sectionTitle={'Relations'} />
            <CardArrayStyleContext.Provider value={`${styles.cardArray} ${styles.collapse}`}>
                <CardArray expand={false}>
                    {animeData.relations.edges.map(relationData => <Relation key={relationData.id} relationData={relationData} />)}
                </CardArray>
            </CardArrayStyleContext.Provider>
        </div>
    ) : <></>
}

function MainPanel() {

    return (
        <div className={styles['main-panel']}>
            <AnimeTitle />
            <AnimeDescription />
            <Relations />
            <Characters />
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

const AnimeDataContext = createContext<AnimeMedia>({ id: -1 })

export default function AnimeDetails(props: { animeID: string }) {

    const [animeData, setAnimeData] = useState({ id: -1 });
    useEffect(() => {
        fetchAnimeMedia(props.animeID).then(data => setAnimeData(data));
    }, [props.animeID])

    return (
        <AnimeDataContext.Provider value={animeData}>
            <UnderDevelopment />
            <div className={styles["all-container"]}>
                <div className={styles["content-container"]}>
                    <Header />
                    <SidePanel />
                    <MainPanel />
                </div>
            </div>
        </AnimeDataContext.Provider>
    )
}