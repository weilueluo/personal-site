import Head from "next/head"
import Playground from "../components/playground/Playground"

export default function PlaygroundPage() {
    return (
        <div>
            <Head>
                <title>Weilue&apos;s Playground</title>
                <meta name="description" content="Weilue Luo&apos;s Personal Website&apos;s Playground."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>
            
            <Playground />
        </div>
    )
}
