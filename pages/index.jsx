import Head from "next/head"

import ThreeJsContent from "../components/home/ThreeJsHome"
import NavigationPanel from "../components/home/NavigationPanel"


export default function Home() {
    return (
        <div>
            <Head>
                <title>Weilue&apos;s Place</title>
                <meta name="description" content="Weilue Luo&apos;s Personal Website."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>
            
            <NavigationPanel />

            <ThreeJsContent />
        </div>
    )
}
