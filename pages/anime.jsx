import Head from "next/head"
import Anime from "../components/anime/anime"


export default function AnimePage() {
    return (
        <>
            <Head>
                <title>Weilue&apos;s Anime Collection</title>
                <meta name="description" content="Weilue Luo&apos;s Anime Collection"/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
                {/* over pass font */}
                <link rel="stylesheet" href="https://overpass-30e2.kxcdn.com/overpass.css" />
            </Head>

            <Anime />
        </>
    )
}