import Head from "next/head"
import RSS from "../components/rss/RSS"

export default function AboutPage() {
    return (
        <div>
            <Head>
                <title>Weilue&apos;s RSS Feed</title>
                <meta name="description" content="Weilue Luo&apos;s RSS Feed."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>

            <RSS />
        </div>
    )
}