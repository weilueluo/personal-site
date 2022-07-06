import Head from "next/head"
import About from "../components/about/About"

export default function AboutPage() {
    return (
        <div>
            <Head>
                <title>About Weilue&apos;s Place</title>
                <meta name="description" content="Weilue Luo&apos;s Personal Website."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>

            <About />
        </div>
    )
}
