import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimeCharacter, AnimeMedia, AnimeRelation } from "../anime";
import { CardImage, useSequentiallyLoadedImageURL } from "../anime/card";
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

    const animeData = useContext(AnimeDataContext);
    const coverImageURL = useSequentiallyLoadedImageURL(animeData.coverImage ? [
        animeData.coverImage.medium,
        animeData.coverImage.large,
    ]: []);

    // console.log('cover image');
    // console.log(animeData);
    // console.log(animeData?.coverImage);
    
    const alt = animeData?.title?.english || 'Cover Image';

    return (
        <div className={styles['side-image-container']}>
            <img className={styles['side-image']} src={coverImageURL} alt={alt} />
        </div>
    )
}


function useImageUrl(imageUrls: {medium?: string, large?: string, extraLarge?: string}) {
    const [url, setURL] = useState('#');

    useEffect(() => {
        if (!imageUrls) {
            console.log('image not available');
            return;
        } else {
            fetchImageAsLocalUrl(imageUrls.medium)
                .then(url => setURL(url))
                .catch(error => console.log(`error loading medium image: ${error}`))
                .then(
                    () => fetchImageAsLocalUrl(imageUrls.large)
                            .then(url => setURL(url))
                            .catch(error => console.log(`error loading large image: ${error}`))
                )
        }
    }, [imageUrls])

    return url;
}

function useRotateString(strings: string[]): [string, () => void] {
    strings = strings.filter(string => string && string.trim() != '');
    if (!strings) {
        strings = ['N/A']
    }
    const [currString, setCurrString] = useState(strings[0]);
    const [index, setIndex] = useState(0);
    const nextString = () => setIndex(index + 1);
    useEffect(() => {
        setCurrString(strings[index % strings.length]);
    }, [index, strings])

    return [currString, nextString];
}

function VoiceActor(props: {characterData: AnimeCharacter}) {
    const VAs = props.characterData.voiceActors;
    let VANames = [];
    if (VAs.length > 0) {
        const names = VAs[0].name
        VANames = [names.full, names.native, ...names.alternative]
    }
    const [vaName, nextName] = useRotateString(VANames)
    if(VAs.length > 0) {
        return (
            <>
                <strong>VA </strong>
                <span className={styles['character-card-voice-actor-name']} onClick={nextName}>{vaName}</span>
            </>
        )
    } else {
        return <></>
    }
}

function CharacterCard(props: {characterData: AnimeCharacter}) {
    const charData = props.characterData;
    const charNode = charData.node;

    const urls = charNode?.image ? [charData.node.image.medium, charData.node.image.large] : [];
    const url = useSequentiallyLoadedImageURL(urls);
    const alt = charNode?.name ? charNode?.name.full : 'Cahracter Image'
    const [charName, nextCharName] = useRotateString([charNode.name.full, charNode.name.native, ...charNode.name.alternative])
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
            <VoiceActor characterData={charData} />
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);
    // console.log('anime characters');
    // console.log(animeData.characters);
    
    if (!animeData.characters) {
        return <></>
    }
    
    return (
        <div>
            <h2 className={styles['character-section-title']}>Characters</h2>
            <div className={styles['character-container']}>
                {animeData.characters.edges.map(charData => <CharacterCard key={charData.id} characterData={charData} />)}
            </div>
        </div>
    )
}

function Hashtag() {
    const animeData = useContext(AnimeDataContext);

    const HashTag = (props: {hashtag: string}) => {
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

    const Tag = (props: {name: string}) => {
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

    const Genre = (props: {genre: string}) => {
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
    const alt = animeData.title ? animeData.title.english : 'Cover Image'

    return (
        <div className={styles['side-panel']}>
            <div className={styles['side-image-container']}>
                <CardImage urls={urls} alt={alt} href={animeData.siteUrl} />
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

function Relation(props: {relationData: AnimeRelation}) {
    const relationData = props.relationData;

    const titles = relationData.node.title;

    const relationUrl = useImageUrl(relationData.node.coverImage);
    const [title, nextTitle]= useRotateString([titles.english, titles.native, titles.romaji])

    return (
        <div className={styles['relation-card-container']}>
            <div className={styles['relation-card-image-container']}>
                <a href={relationData.node.siteUrl}>
                    <img className={styles['relation-card-image']} src={relationUrl} alt={'Relation Card Image'} />
                </a>
            </div>
            <strong className={styles['relation-type']}>{relationData.relationType} </strong>
            <span className={styles['relation-title']} onClick={nextTitle}>{title}</span>
        </div>
    )
}

function Relations() {
    const animeData = useContext(AnimeDataContext)
    if (!animeData.relations) {
        return <></>
    } else {
        return (
            <div>
                <h2>Relations</h2>
                <div className={styles['relation-container']}>
                        {animeData.relations.edges.map(relationData => <Relation key={relationData.id} relationData={relationData} />)}
                </div>
            </div>
        )
    }
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

const AnimeDataContext = createContext<AnimeMedia>({id: -1})

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