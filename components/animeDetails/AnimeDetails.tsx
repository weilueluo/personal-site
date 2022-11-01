import { createContext, useContext, useEffect, useState } from "react";
import { AnimeCharacter, AnimeMedia, AnimeRelation, AnimeStaff } from "../anime";
import LoadingCard from "../anime/card/LoadingCard";
import { SegmentedDataFetching, useMediaCharactersFetching, useMediaStaffsFetching } from "../anime/data/hooks";
import { useSequentiallyLoadedImageURL } from "../anime/data/misc";
import { Media, Relation } from "../anime/data/query";
import { fetchAnilistMedia } from "../anime/data/request";
import { useRotateString } from "../anime/utils";
import { timeSinceSeconds } from "../common/misc";
import { mergeStyles } from "../common/styles";
import styles from './AnimeDetails.module.sass';


function BannerImage() {

    const animeData = useContext(AnimeDataContext)

    const [imageUrl, index] = useSequentiallyLoadedImageURL([animeData.bannerImage])

    const alt = animeData.title ? animeData.title.english : animeData.id.toString()

    const imageStyle = mergeStyles(styles.bannerImage, (index == 0) && styles.loadingImage)

    if (animeData.id == LOADING_ID) {
        return (
            <div className={mergeStyles(styles.bannerImageContainer, styles.loadingBannerImage)}>
                <LoadingCard banner={true} scale={8}/>
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

function SmallTextLoadingCard() {
    return (
        <LoadingCard banner={true} style={{
            width: '50px',
            height: '25px'
        }}/>
    )
}

const SMALL_TEXT_LOADING_CARDS = Array.from(Array(10)).map((_, i) => <SmallTextLoadingCard key={i} />)

const SECTION_LOADING_CARDS = Array.from(Array(10)).map((_, i) => <LoadingCard key={i} style={{height: 'clamp(140px, 200px, 35vw)', width: 'clamp(80px, 120px, 20vw)'}}/>)

function Hashtags() {
    const animeData = useContext(AnimeDataContext);

    const HashTag = (props: { hashtag: string }) => {
        return <div className={styles.hashtag}>{props.hashtag}</div>
    }

    if (animeData.id == LOADING_ID) {
        return (
            <div className={styles.hashtagContainer}>
                {SMALL_TEXT_LOADING_CARDS}
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
                {SMALL_TEXT_LOADING_CARDS}
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
                {SMALL_TEXT_LOADING_CARDS}
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

    const statusRaw = animeData?.status || 'UNKNOWN';
    const status = statusRaw.replace('_', '');

    return (
        <span className={styles.status}>
            {status} {animeData?.season || ''} {animeData?.seasonYear || ''}
        </span>
    )
}

function NextAiring() {
    const animeData = useContext(AnimeDataContext);

    const timeUntilNextAiring = animeData?.nextAiringEpisode && timeSinceSeconds(animeData.nextAiringEpisode?.timeUntilAiring || 0);

    const nextEpisode = animeData.nextAiringEpisode?.episode || 1;
    const totalEpisode = animeData.episodes || 1;

    const breakpoint = Math.max(nextEpisode - 1, 0) / totalEpisode * 100

    return  (
        <span className={styles.nextAiring} style={{
            background: `linear-gradient(90deg, rgba(57,119,219,0.8) 0% ${breakpoint}%, rgba(57,119,219,0.5) ${breakpoint+1}% 100%)`
        }}>
            {
                animeData?.nextAiringEpisode 
                ? `Ep. ${nextEpisode}/${totalEpisode} in ${timeUntilNextAiring}`
                : 'Episode N/A'
            }
        </span>
    )
}

function Score() {
    const animeData = useContext(AnimeDataContext);

    const breakpoint = Math.max(animeData?.meanScore || 50, 0);

    return (
        <span className={styles.meanScore} style={{
            color: 'black',
            background: `linear-gradient(90deg, rgba(209,96,104,0.8) 0% ${breakpoint}%, rgba(209,96,104,0.5) ${breakpoint+1}% 100%)`
        }}>
             {animeData?.meanScore ? `Rating ${animeData.meanScore}` : 'Score Unavailable'}
        </span>
    )
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

    const [title, setTitle] = useState<string>('N/A');
    const [index, setIndex] = useState<number>(0);
    const nextTitle = () => setIndex(index + 1);
    useEffect(() => {
        const titles: string[] = (animeData && animeData.title) ? [animeData.title.romaji, animeData.title.native, animeData.title.english, ...(animeData.synonyms ? animeData.synonyms : [])] : ['N/A'];
        setTitle(titles[index % titles.length])
    }, [index, animeData])

    return <span className={styles.animeTitle} onClick={nextTitle}>{title}</span>
}

function AnimeDescription() {
    const animeData = useContext(AnimeDataContext);

    const descStyle = mergeStyles(styles.animeDescription, !animeData.description && styles.noDescriptionAvailable)
    if (!animeData?.description) {
        return <p className={descStyle}>{'No Description Available'}</p>
    } else {
        return <p className={descStyle} dangerouslySetInnerHTML={{ __html: animeData.description }} />
    }

}

function Relation_(props: { relationData: Relation }) {
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
    const animeData = useContext(AnimeDataContext);

    const relations = animeData?.relations 
        ? animeData.relations.edges.map(relationData => <Relation_ key={relationData.id} relationData={relationData} />) 
        : (animeData?.id == LOADING_ID ? SECTION_LOADING_CARDS : <></>)

    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);

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
    segmentedDataFetching,
    renderFunction
}: {
    title: string,
    segmentedDataFetching: SegmentedDataFetching<T>,
    renderFunction: (data: T[]) => JSX.Element[]
}) {
    const [loadedData, loading, pageInfo, loadMore] = segmentedDataFetching;

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

    const [loadButtonText, setLoadButtonText] = useState('');
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
        displayAmount > loadedData.length && !pageInfo.hasNextPage && styles.allLoaded,
        loading && styles.loading
    )

    const cardListStyle = mergeStyles(styles.cardList, styles.collapse);

    const animeData = useContext(AnimeDataContext);

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>{title}</span>
                {(animeData.id != LOADING_ID) && <button className={buttonStyle} onClick={loadButtonClick}>{loadButtonText}</button>}
            </div>
            <ul className={cardListStyle}>
                {
                    animeData.id == LOADING_ID
                        ? SECTION_LOADING_CARDS
                        : renderFunction(displayData)
                }
            </ul>
        </div>
    )
}

function Characters() {
    const animeData = useContext(AnimeDataContext);
    const dataManagement = useMediaCharactersFetching(animeData.id, animeData?.characters?.edges, animeData?.characters?.edges ? 2 : 1);
    const renderFunction = (displayData: AnimeCharacter[]) => displayData.map(charData => <Character key={charData.id} characterData={charData} />)
    return <CardsSection title='Characters' segmentedDataFetching={dataManagement} renderFunction={renderFunction} />
}

function Staffs() {
    const animeData = useContext(AnimeDataContext);
    const dataManagement = useMediaStaffsFetching(animeData.id, animeData?.staff?.edges, animeData?.staff?.edges ? 2 : 1);
    const renderFunction = (displayData: AnimeStaff[]) => displayData.map(staffData => <Staff key={staffData.id} staffData={staffData} />)
    return <CardsSection title='Staffs' segmentedDataFetching={dataManagement} renderFunction={renderFunction} />
}

const TRAILER_LOADING_CARD = <LoadingCard banner={true} style={{ height: '350px' }} scale={6}/>

function Trailer() {
    const animeData = useContext(AnimeDataContext);

    const videoSource = animeData?.trailer?.site == 'youtube'
        ? `https://www.youtube.com/embed/${animeData?.trailer?.id}`
        : `https://www.dailymotion.com/embed/video/${animeData?.trailer?.id}?autoplay=0`

    // if (animeData.id == LOADING_ID) {
    //     return (
    //         <div className={styles.trailerContainer}>
    //             <div className={styles.sectionHeader}>
    //                 <span className={styles.sectionTitle}>Trailer</span>
    //             </div>
    //             loading ...
    //         </div>
    //     )
    // }

    return (
        <div className={styles.trailerContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Trailer</span>
            </div>
            {
                animeData?.id == LOADING_ID
                ? <iframe
                    className={styles.trailer}
                    src={videoSource}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}>
                </iframe>
                : (animeData?.trailer ? TRAILER_LOADING_CARD : <></>)
            }
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

const LOADING_ID = -1;

export const AnimeDataContext = createContext<Media>({ id: LOADING_ID })

export default function AnimeDetails(props: { animeID: string }) {

    const [animeData, setAnimeData] = useState({ id: LOADING_ID });
    useEffect(() => {
        fetchAnilistMedia(Number(props.animeID)).then(data => setAnimeData(data));
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