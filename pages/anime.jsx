import Head from "next/head"
import Anime from "../components/anime/anime"


export default function AnimePage() {
    return (
        <>
            <Head>
                <title>Weilue&apos;s Anime Collection</title>
                <meta name="description" content="Weilue Luo&apos;s Anime Collection"/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>

            <Anime />
        </>
    )
}