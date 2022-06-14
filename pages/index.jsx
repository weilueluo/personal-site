import Head from 'next/head'

import ThreeJSHome from '../components/home/Home'

export default function Home() {
    return (
        <div>
            <Head>
                <title>Weilue's Place</title>
                <meta name="description" content="Weilue Luo's Personal Website."/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>

            <ThreeJSHome/>
        </div>
    )
}
