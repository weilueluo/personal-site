import { createContext, FC, useContext, useEffect, useState } from "react";
import { AnimeCharacter, AnimeCharactersMedia, AnimeMedia, AnimeRelation, PageInfo, AnimeStaff } from "../anime";
import { DataManagement } from "../anime/data";
import { useCharactersDataManagement } from "../anime/data/characters";
import { fetchAnimeMedia } from "../anime/data/media";
import { useAnimeStaffsDataManagement } from "../anime/data/staffs";
import { useRotateString } from "../anime/hooks";
import { useSequentiallyLoadedImageURL } from "../common/hooks";
import { timeSinceSeconds } from "../common/misc";
import { mergeStyles } from "../common/styles";
import styles from './AnimeDetails.module.sass';

export const LOADING_ID = -1;

function BannerImage() {

    const animeData = useContext(AnimeDataContext)

    const [imageUrl, index] = useSequentiallyLoadedImageURL([animeData.bannerImage])

    const alt = animeData.title ? animeData.title.english : animeData.id.toString()

    const imageStyle = mergeStyles(styles.bannerImage, index == 0 && styles.loadingImage)

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.bannerImageContainer}>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.bannerImageContainer}>
            {/* eslint-disable-next-line */}
            {animeData.bannerImage && <img className={imageStyle} src={imageUrl} alt={alt} />}  
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
    const [url, index] = useSequentiallyLoadedImageURL(urls);
    const alt = charNode?.name ? charNode?.name.full : 'Character Image'
    const [charName, nextCharName] = useRotateString([charNode.name.full, charNode.name.native, ...charNode.name.alternative])
    const href = charData.node.siteUrl

    const cardTitleStyle = mergeStyles(styles.title, styles.characterTitle);
    const imageStyle = mergeStyles(styles.image, index == 0 && styles.loadingImage)

    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    {/* eslint-disable-next-line */}
                    <img src={url} alt={alt} className={imageStyle} />
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

function Staff(props: { staffData: AnimeStaff }) {
    const staffData = props.staffData.node;

    const staffNames = staffData.name ? [staffData.name.full, staffData.name.native, ...staffData.name.alternative] : []
    const [staffName, nextName] = useRotateString(staffNames);

    const role = props.staffData.role || 'N/A'

    const imageURLs = staffData.image ? [staffData.image.medium, staffData.image.large] : [];
    const [imageURL, index] = useSequentiallyLoadedImageURL(imageURLs);

    const imageStyle = mergeStyles(styles.image, index == 0 && styles.loadingImage)

    const href = staffData.siteUrl


    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    {/* eslint-disable-next-line */}
                    <img src={imageURL} alt={'Staff Image'} className={imageStyle} />
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
            {
                animeData.hashtag && animeData.hashtag.split(' ').map(hashtag => <HashTag key={hashtag} hashtag={hashtag} />)
                || <HashTag hashtag={'-No Hashtag Available-'} />
            }
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
            {
                animeData.tags && animeData.tags.map(tag => <Tag key={tag.name} name={tag.name} />)
                || <Tag name={'-No Tag Available-'} />
            }
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
                {
                    animeData.genres && animeData.genres.map(genre => <Genre key={genre} genre={genre} />)
                    || <Genre genre={'-No Genre Available-'} />
                }
            </div>
        )
    }
}

function Status() {
    const animeData = useContext(AnimeDataContext);

    return (
        <span className={styles.status}>
            {animeData?.status || 'UNKNOWN'} - {animeData?.season || ''} {animeData?.seasonYear || ''}
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

    const left = Math.max((animeData?.meanScore - 2) || 0, 0);
    const right = Math.min((animeData?.meanScore + 2) || 100, 100);

    return animeData.meanScore ? (
        <span className={styles.meanScore} style={{
            color: (animeData?.meanScore || 0) > 55 ? 'black' : 'white',
            background: `linear-gradient(90deg, rgba(209,96,104,1) 0%, rgba(209,96,104,1) ${left}%, rgba(209,96,104,1) ${animeData.meanScore}%, rgba(0,0,0,1) 100%)`
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
    const [imageUrl, index] = useSequentiallyLoadedImageURL(urls);

    const imageStyle = mergeStyles(styles.sidePanelImage, index == 0 && styles.loadingImage)

    const alt = animeData.title ? animeData.title.english : 'Cover Image'
    const href = animeData.siteUrl;

    return (
        <div className={styles.sidePanel}>
            <div className={styles.sidePanelCard}>
                <div className={styles.sidePanelImageContainer}>
                    <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                        {/* eslint-disable-next-line */}
                        <img className={imageStyle} src={imageUrl} alt={alt} />
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

    const [relationUrl, index] = useSequentiallyLoadedImageURL(coverImages && [coverImages.medium, coverImages.large]);
    const imageStyle = mergeStyles(styles.image, index == 0 && styles.loadingImage)

    const [title, nextTitle] = useRotateString([titles.english, titles.native, titles.romaji])
    const href = relationData.node.siteUrl;

    return (
        <li className={styles.card}>
            <div className={styles.imageContainer}>
                <a className={styles.link} href={href} onClick={e => !href && e.preventDefault()}>
                    {/* eslint-disable-next-line */}
                    <img src={relationUrl} alt={'relation'} className={imageStyle} />
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
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Relations</span>
                </div>
                loading ...
            </div>
        )
    }

    return (
        <div className={styles.relationContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Relations</span>
            </div>
            <ul className={cardListStyle}>
                {relations}
            </ul>
        </div>
    )
}

function CardsSection<T>({
    title,
    dataManagement,
    renderFunction
}: {
    title: string,
    dataManagement: DataManagement<T>,
    renderFunction: (data: T[]) => JSX.Element[]
}) {
    const [loadedData, loading, pageInfo, loadMore, deps] = dataManagement;

    // should already contain some data
    // useEffect(() => {
    //     loadMore();
    // }, deps) // eslint-disable-line

    // useEffect(() => {
    //     console.log(loadedData)
    // }, [loadedData])

    const [displayAmount, setDisplayAmount] = useState(15);
    const [displayData, setDisplayData] = useState([]);
    useEffect(() => {
        setDisplayData(loadedData.slice(0, displayAmount));
    }, [loadedData, displayAmount]);

    const [loadButtonText, setLoadButtonText] =  useState('');
    const [firstClick, setFirstClick] = useState(true);
    useEffect(() => {
        if (loading) {
            setLoadButtonText('loading')
        } else if (displayAmount > loadedData.length && !pageInfo.hasNextPage) {
            setLoadButtonText('all loaded')
        } else {
            setLoadButtonText('load more')
        }
    }, [loading, displayAmount, loadedData, pageInfo.hasNextPage]);
    const loadButtonClick = () => {
        setFirstClick(false);
        setDisplayAmount(displayAmount + 20);
    };
    useEffect(() => {
        if (!firstClick && displayAmount > loadedData.length && pageInfo.hasNextPage) {
            loadMore();
        }
    }, [displayAmount]) // eslint-disable-line
    const buttonStyle = mergeStyles(
        styles.loadButton,
        displayAmount > loadedData.length && !pageInfo.hasNextPage && styles.allLoaded
    )
    
    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);
    
    const animeData = useContext(AnimeDataContext);

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>{title}</span>
                {(animeData.id != LOADING_ID) && <button className={buttonStyle} onClick={loadButtonClick}>{loadButtonText}</button>}
            </div>
            {
                animeData.id == LOADING_ID
                ? 'loading ...'
                : (
                    <ul className={cardListStyle}>
                        {renderFunction(displayData)}
                    </ul>
                )
            }
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);
    const dataManagement = useCharactersDataManagement(animeData.id);
    const renderFunction = (displayData: AnimeCharacter[]) => displayData.map(charData => <Character key={charData.id} characterData={charData} />)
    return <CardsSection title='Characters' dataManagement={dataManagement} renderFunction={renderFunction} />
}

function Staffs() {
    const animeData = useContext(AnimeDataContext);
    const dataManagement = useAnimeStaffsDataManagement(animeData.id);
    const renderFunction = (displayData: AnimeStaff[]) => displayData.map(staffData => <Staff key={staffData.id} staffData={staffData} />)
    return <CardsSection title='Staffs' dataManagement={dataManagement} renderFunction={renderFunction} />
}

function Trailer() {
    const animeData = useContext(AnimeDataContext);

    if (!animeData) {
        return <span>loading ...</span>
    }

    const videoSource = animeData?.trailer?.site == 'youtube'
        ? `https://www.youtube.com/embed/${animeData?.trailer?.id}`
        : `https://www.dailymotion.com/embed/video/${animeData?.trailer?.id}?autoplay=0`

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.trailerContainer}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Trailer</span>
                </div>
                loading ...
            </div>
        )
    }

    return animeData.trailer ? (
        <div className={styles.trailerContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Trailer</span>
            </div>
            <iframe
                className={styles.trailer}
                src={videoSource}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}>
            </iframe>
        </div>
    ) : <></>
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

export const AnimeDataContext = createContext<AnimeMedia>({ id: LOADING_ID })

export default function AnimeDetails(props: { animeID: string }) {

    const [animeData, setAnimeData] = useState({ id: LOADING_ID });
    useEffect(() => {
        fetchAnimeMedia(props.animeID).then(data => setAnimeData(data));
    }, [props.animeID])

    return (
        <AnimeDataContext.Provider value={animeData}>
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