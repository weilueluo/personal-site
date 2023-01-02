import Head from "next/head"
import HomePage from "../components/home/HomePage"

export default function NewHome() {
    return (
        <div>
            <Head>
                <title>Weilue&apos;s Place</title>
                <meta name="description" content="Weilue Luo&apos;s Personal Website."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
                <link href="https://fonts.cdnfonts.com/css/nunito" rel="stylesheet" />
            </Head>
            
            <HomePage />

        </div>
    )
}
