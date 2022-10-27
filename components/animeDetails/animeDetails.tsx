import { createContext, useContext, useEffect, useState } from "react";
import { AnimeCharacter, AnimeMedia, AnimeRelation } from "../anime";
import { fetchAnimeMedia } from "../anime/data";
import { useRotateString } from "../anime/hooks";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import UnderDevelopment from "../common/UnderDevelopment";
import cardStyles from '../anime/styles/Card.module.sass';
import sectionStyles from '../anime/styles/Section.module.sass';
import styles from './AnimeDetails.module.sass';
import { mergeStyles } from "../common/styles";

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

    return animeData.bannerImage ? (
        <div className={styles.bannerImageContainer}>
            <img className={styles.bannerImage} src={imageUrl} alt={alt} />
        </div>
    ) : <></>
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
            <span className={styles.voiceActorName} onClick={nextName}>{VANAme}</span>
        </>
    ) : <></>
}

function Character(props: { characterData: AnimeCharacter }) {
    const charData = props.characterData;
    const charNode = charData.node;

    const urls = charNode?.image ? [charData.node.image.medium, charData.node.image.large] : [];
    const url = useSequentiallyLoadedImageURL(urls);
    const alt = charNode?.name ? charNode?.name.full : 'Character Image'
    const [charName, nextCharName] = useRotateString([charNode.name.full, charNode.name.native, ...charNode.name.alternative])
    const href = charData.node.siteUrl

    const cardTitleStyle = mergeStyles(cardStyles.title, styles.title, styles.characterTitle);
    const cardStyle = mergeStyles(cardStyles.card, styles.card);
    const imgStyle = mergeStyles(cardStyles.image, styles.image);

    return (
        <li className={cardStyle}>
            <div className={cardStyles.imageContainer}>
                <a className={cardStyles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={url} alt={alt} className={imgStyle} />
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

    return animeData.hashtag ? (
        <div className={styles.hashtagContainer}>
            {animeData.hashtag.split(' ').map(hashtag => <HashTag key={hashtag} hashtag={hashtag} />)}
        </div>
    ) : <></>
}

function Tags() {
    const animeData = useContext(AnimeDataContext);

    const Tag = ({name}: { name: string }) => {
        return <div className={styles.tag}>{name}</div>
    }

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.tagContainer}>
                loading ...
            </div>
        )
    }

    return animeData.tags ? (
        <div className={styles.tagContainer}>
            {animeData.tags.map(tag => <Tag key={tag.name} name={tag.name} />)}
        </div>
    ) : <></>
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
        return animeData.genres ? (
            <div className={styles.genreContainer}>
                {animeData.genres.map(genre => <Genre key={genre} genre={genre} />)}
            </div>
        ) : <></>
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
    const href = animeData.siteUrl;

    const cardStyle = mergeStyles(cardStyles.card, styles.card, styles.sidePanelCard);
    const imgStyle = mergeStyles(cardStyles.image, styles.image, styles.sidePanelImage);

    return (
        <div className={styles.sidePanel}>
            <div className={cardStyle}>
                <div className={cardStyles.imageContainer}>
                    <a className={cardStyles.link} href={href} onClick={e => !href && e.preventDefault()}>
                        <img src={imageUrl} alt={alt} className={imgStyle} />
                    </a>
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
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english] : [];
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

    const cardTitleStyle = mergeStyles(cardStyles.title, styles.title);
    const cardStyle = mergeStyles(cardStyles.card, styles.card);
    const imgStyle = mergeStyles(cardStyles.image, styles.image);

    return (
        <li className={cardStyle}>
            <div className={cardStyles.imageContainer}>
                <a className={cardStyles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={relationUrl} alt={'relation'} className={imgStyle} />
                </a>
            </div>

            <div className={cardTitleStyle}>
                <strong>{relationData.relationType}</strong><br />
                <span onClick={nextTitle}>{title}</span>
            </div>
        </li>
    )
}

function Relations() {
    const animeData = useContext(AnimeDataContext)
    const relations = animeData.relations ? animeData.relations.edges.map(relationData => <Relation key={relationData.id} relationData={relationData} />) : <></>

    const cardListStyle = mergeStyles(cardStyles.cardList, cardStyles.collapse);
    const sectionTitleStyle = mergeStyles(sectionStyles.sectionTitle, styles.sectionTitle)

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.relationContainer}>
                <span className={sectionTitleStyle}>Relations</span>
                loading ...
            </div>
        )
    } else if (!animeData.relations) {
        return <></>
    }

    return (
        <div className={styles.relationContainer}>
            <span className={sectionTitleStyle}>Relations</span>
            <ul className={cardListStyle}>
                {relations}
            </ul>
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);
    const characters = animeData.characters ? animeData.characters.edges.map(charData => <Character key={charData.id} characterData={charData} />) : <></>
    const cardListStyle = mergeStyles(cardStyles.cardList, cardStyles.collapse);
    const sectionTitleStyle = mergeStyles(sectionStyles.sectionTitle, styles.sectionTitle)

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.charactersContainer}>
                <span className={sectionTitleStyle}>Characters</span>
                loading ...
            </div>
        )
    } else if (!animeData.characters) {
        return <></>
    } else {
        return (
            <div className={styles.charactersContainer}>
                <span className={sectionTitleStyle}>Characters</span>
                <ul className={cardListStyle}>
                    {characters}
                </ul>
            </div>
        )
    }
}

function MainPanel() {

    return (
        <div className={styles.mainPanel}>
            <div>
                <AnimeTitle />
                <AnimeDescription />
            </div>
            <Characters />
            <Relations />
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