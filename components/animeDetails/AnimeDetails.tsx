import { createContext, useContext, useEffect, useState } from "react";
import { AnimeCharacter, AnimeMedia, AnimeRelation, Staff } from "../anime";
import { fetchAnimeMedia } from "../anime/data";
import { useRotateString } from "../anime/hooks";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import { timeSinceSeconds } from "../common/misc";
import { mergeStyles } from "../common/styles";
import UnderDevelopment from "../common/UnderDevelopment";
import styles from './AnimeDetails.module.sass';

const LOADING_ID = -1;

function BannerImage() {

    const animeData = useContext(AnimeDataContext)

    const imageUrl = useSequentiallyLoadedImageURL([animeData.bannerImage])

    const alt = animeData.title ? animeData.title.english : animeData.id.toString()

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.bannerImageContainer}>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.bannerImageContainer}>
            {animeData.bannerImage && <img className={styles.bannerImage} src={imageUrl} alt={alt} />}
        </div>
    )
}

function VoiceActorName(props: { characterData: AnimeCharacter }) {
    const VAs = props.characterData.voiceActors;
    const [VANames, setVANames] = useState([]);
    const [VANAme, nextName] = useRotateString(VANames)
    useEffect(() => {
        if (VAs && VAs.length > 0) {
            const names = VAs[0].name
            setVANames([names.full, names.native, ...names.alternative])
        }
    }, [VAs])

    return VAs ? (
        <>
            <strong>VA</strong><br />
            <span onClick={nextName}>{VANAme}</span>
        </>
    ) : (
        <span>N/A</span>
    )
}

function Character(props: { characterData: AnimeCharacter }) {
    const charData = props.characterData;
    const charNode = charData.node;

    const urls = charNode?.image ? [charData.node.image.medium, charData.node.image.large] : [];
    const url = useSequentiallyLoadedImageURL(urls);
    const alt = charNode?.name ? charNode?.name.full : 'Character Image'
    const [charName, nextCharName] = useRotateString([charNode.name.full, charNode.name.native, ...charNode.name.alternative])
    const href = charData.node.siteUrl

    const cardTitleStyle = mergeStyles(styles.title, styles.characterTitle);

    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={url} alt={alt} className={styles.image} />
                </a>
            </div>

            <div className={cardTitleStyle}>
                <strong>{charData.role} </strong><br />
                <span onClick={nextCharName}>{charName}</span><br />
                <VoiceActorName characterData={charData} />
            </div>
        </li>
    )
}

function Staff(props: { staffData: Staff }) {
    const staffData = props.staffData.node;

    const staffNames = staffData.name ? [staffData.name.full, staffData.name.native, ...staffData.name.alternative] : []
    const [staffName, nextName] = useRotateString(staffNames);

    const role = props.staffData.role || 'N/A'

    const imageURLs = staffData.image ? [staffData.image.medium, staffData.image.large] : [];
    const imageURL = useSequentiallyLoadedImageURL(imageURLs);

    const href = staffData.siteUrl


    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={imageURL} alt={'Staff Image'} className={styles.image} />
                </a>
            </div>

            <div className={styles.title}>
                <strong>{role}</strong><br />
                <span onClick={nextName}>{staffName}</span>
            </div>
        </li>
    )
}

function Hashtags() {
    const animeData = useContext(AnimeDataContext);

    const HashTag = (props: { hashtag: string }) => {
        return <div className={styles.hashtag}>{props.hashtag}</div>
    }

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.hashtagContainer}>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.hashtagContainer}>
            {animeData.hashtag && animeData.hashtag.split(' ').map(hashtag => <HashTag key={hashtag} hashtag={hashtag} />)}
        </div>
    )
}

function Tags() {
    const animeData = useContext(AnimeDataContext);

    const Tag = ({ name }: { name: string }) => {
        return <div className={styles.tag}>{name}</div>
    }

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.tagContainer}>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.tagContainer}>
            {animeData.tags && animeData.tags.map(tag => <Tag key={tag.name} name={tag.name} />)}
        </div>
    )
}

function Genres() {

    const animeData = useContext(AnimeDataContext);

    const Genre = ({ genre }: { genre: string }) => {
        return <div className={styles.genre}>{genre}</div>;
    }

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.genreContainer}>
                loading ...
            </div>
        )
    } else {
        return (
            <div className={styles.genreContainer}>
                {animeData.genres && animeData.genres.map(genre => <Genre key={genre} genre={genre} />)}
            </div>
        )
    }
}

function Status() {
    const animeData = useContext(AnimeDataContext);

    return (
        <span className={styles.status}>
            {animeData?.status || 'UNKNOWN'}
        </span>
    )
}

function NextAiring() {
    const animeData = useContext(AnimeDataContext);

    const timeUntilNextAiring = animeData.nextAiringEpisode && timeSinceSeconds(animeData.nextAiringEpisode.timeUntilAiring);

    return animeData.nextAiringEpisode ? (
        <span className={styles.nextAiring}>
            Ep. {animeData.nextAiringEpisode.episode}/{animeData.episodes || 12} in {timeUntilNextAiring}
        </span>
    ) : <></>
}

function Score() {
    const animeData = useContext(AnimeDataContext);

    const left = Math.max((animeData?.meanScore - 25) || 0, 0);
    const right = Math.min((animeData?.meanScore + 25) || 100, 100);

    return animeData.meanScore ? (
        <span className={styles.meanScore} style={{
            color: '#ffaaaa',
            background: `linear-gradient(90deg, rgba(209,96,104,1) 0%, rgba(209,96,104,1) ${left}%, rgba(0,0,0,1) ${animeData.meanScore}%, rgba(209,96,104,1) ${right}%, rgba(209,96,104,1) 100%)`
        }}>
            Score - {animeData.meanScore}
        </span>
    ) : <></>
}

function SidePanel() {

    const animeData = useContext(AnimeDataContext);

    const [urls, setUrls] = useState([]);
    useEffect(() => {
        animeData.coverImage && setUrls([animeData.coverImage.medium, animeData.coverImage.large])
    }, [animeData.coverImage])
    const imageUrl = useSequentiallyLoadedImageURL(urls);

    const alt = animeData.title ? animeData.title.english : 'Cover Image'
    const href = animeData.siteUrl;

    const cardStyle = mergeStyles(styles.card, styles.sidePanelCard);
    const imgStyle = mergeStyles(styles.image, styles.sidePanelImage);
    const imgContainerStyle = mergeStyles(styles.imageContainer);

    return (
        <div className={styles.sidePanel}>
            <div className={cardStyle}>
                <div className={imgContainerStyle}>
                    <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                        <img src={imageUrl} alt={alt} className={imgStyle} />
                    </a>
                </div>
                <div className={styles.metadata}>
                    <Status />
                    <NextAiring />
                    <Score />
                </div>
            </div>
            <Genres />
            <Hashtags />
            <Tags />
        </div>
    )
}

function AnimeTitle() {
    const animeData = useContext(AnimeDataContext)

    const [title, setTitle] = useState<string>('~Title Not Available~');
    const [index, setIndex] = useState<number>(0);
    const nextTitle = () => setIndex(index + 1);
    useEffect(() => {
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english, ...(animeData.synonyms ? animeData.synonyms : [])] : [];
        setTitle(titles[index % titles.length])
    }, [index, animeData])

    return <span className={styles.animeTitle} onClick={nextTitle}>{title}</span>
}

function AnimeDescription() {
    const animeData = useContext(AnimeDataContext);

    const descStyle = mergeStyles(styles.animeDescription, !animeData.description && styles.noDescriptionAvailable)
    if (animeData.id == LOADING_ID) {
        return <p className={descStyle}>loading ...</p>
    } else if (!animeData.description) {
        return <p className={descStyle}>{'~No Description Available~'}</p>
    } else {
        return <p className={descStyle} dangerouslySetInnerHTML={{ __html: animeData.description }} />
    }

}

function Relation(props: { relationData: AnimeRelation }) {
    const relationData = props.relationData;

    const titles = relationData.node.title;
    const coverImages = relationData.node.coverImage;

    const relationUrl = useSequentiallyLoadedImageURL(coverImages && [coverImages.medium, coverImages.large]);
    const [title, nextTitle] = useRotateString([titles.english, titles.native, titles.romaji])
    const href = relationData.node.siteUrl;

    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={relationUrl} alt={'relation'} className={styles.image} />
                </a>
            </div>

            <div className={styles.title}>
                <strong>{relationData.relationType}</strong><br />
                <span onClick={nextTitle}>{title}</span>
            </div>
        </li>
    )
}

function Relations() {
    const animeData = useContext(AnimeDataContext)
    const relations = animeData.relations ? animeData.relations.edges.map(relationData => <Relation key={relationData.id} relationData={relationData} />) : <></>

    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.relationContainer}>
                <span className={styles.sectionTitle}>Relations</span>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.relationContainer}>
            <span className={styles.sectionTitle}>Relations</span>
            <ul className={cardListStyle}>
                {relations}
            </ul>
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);
    const characters = animeData.characters ? animeData.characters.edges.map(charData => <Character key={charData.id} characterData={charData} />) : <></>
    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.charactersContainer}>
                <span className={styles.sectionTitle}>Characters</span>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.charactersContainer}>
            <span className={styles.sectionTitle}>Characters</span>
            <ul className={cardListStyle}>
                {characters}
            </ul>
        </div>
    )
}

function Staffs() {
    const animeData = useContext(AnimeDataContext);
    const staffs = (animeData && animeData.staff) ? animeData.staff.edges.map(staffData => <Staff key={staffData.id} staffData={staffData} />) : <></>
    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.staffsContainer}>
                <span className={styles.sectionTitle}>Staffs</span>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.staffsContainer}>
            <span className={styles.sectionTitle}>Staffs</span>
            <ul className={cardListStyle}>
                {staffs}
            </ul>
        </div>
    )
}

function Trailer() {
    const animeData = useContext(AnimeDataContext);

    if (!animeData) {
        return <span>loading ...</span>
    }

    const videoSource = animeData?.trailer?.site == 'youtube'
        ? `https://www.youtube.com/embed/${animeData?.trailer?.id}`
        : `https://www.dailymotion.com/embed/video/${animeData?.trailer?.id}?autoplay=0`

    return (
        <div className={styles.trailerContainer}>
            <span className={styles.sectionTitle}>Trailer</span>
            {animeData.trailer && <iframe
                className={styles.trailer}
                src={videoSource}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}>
            </iframe>}
        </div>
    )

}

function MainPanel() {

    return (
        <div className={styles.mainPanel}>
            <div>
                <AnimeTitle />
                <AnimeDescription />
            </div>
            <Trailer />
            <Relations />
            <Characters />
            <Staffs />
        </div>
    )
}

function Header() {
    return (
        <div className={styles.header}>
            <BannerImage />
        </div>
    )
}

const AnimeDataContext = createContext<AnimeMedia>({ id: LOADING_ID })

export default function AnimeDetails(props: { animeID: string }) {

    const [animeData, setAnimeData] = useState({ id: LOADING_ID });
    useEffect(() => {
        fetchAnimeMedia(props.animeID).then(data => setAnimeData(data));
    }, [props.animeID])

    return (
        <AnimeDataContext.Provider value={animeData}>
            <UnderDevelopment />
            <div className={styles.allContainer}>
                <div className={styles.contentContainer}>
                    <Header />
                    <SidePanel />
                    <MainPanel />
                </div>
            </div>
        </AnimeDataContext.Provider>
    )
}