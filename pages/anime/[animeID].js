import Head from 'next/head';
import { useRouter } from 'next/router';
import { slowlyFetchAllAnimeData } from '../../components/anime/data';
import AnimeDetails from '../../components/animeDetails/AnimeDetails';

export default function AnimeDetailsPage(props) {

    const router = useRouter();
    const { animeID } = router.query;

    return (
        <>
            <Head>
                <title>Weilue&apos;s Anime Collection</title>
                <meta name="description" content="Weilue Luo&apos;s Anime Collection" />
                <link rel="icon" href="/icons/favicon-32x32.png" />
                {/* over pass font */}
                <link rel="stylesheet" href="https://overpass-30e2.kxcdn.com/overpass.css" />
            </Head>

            {/* <AnimeDetails animeID={animeID} animeData={props.animeData} /> */}
            <AnimeDetails animeID={animeID} />
        </>
    )
}

// const CACHED_ANIME_DATA_FILE = 'cachedAnimeData.json';

export async function getStaticPaths() {

    // const cachedData = {};

    const paths = await slowlyFetchAllAnimeData().then(datum => datum.map(animeData => {

        const animeIDString = animeData.id.toString();
        // cachedData[animeIDString] = animeData;

        return {
            params: {
                animeID: animeIDString,
                // animeData: animeData
            }
        };
    }));

    // we save the loaded data into a file, for later getStaticProps to read and pass to individual page
    // so that we do not need to flood requests to query all pages' anime data at once when we build 
    // to generate all static pages
    // const fs = require('fs')
    // fs.writeFileSync(CACHED_ANIME_DATA_FILE, JSON.stringify(cachedData, null, 4), 'utf-8');

    return {
        paths: paths,
        fallback: false
    }
}

export async function getStaticProps(context) {
    // const fs = require('fs');
    // const cachedData = JSON.parse(fs.readFileSync(CACHED_ANIME_DATA_FILE, {
    //     encoding: 'utf-8'
    // }))
    // console.log('context');
    // console.log(context);
    // console.log(cachedData[context.params.animeID]);
    return {
        props: {
            // animeData: cachedData[context.params.animeID]
        }
    }
}