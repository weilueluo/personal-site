import Head from 'next/head'

import styles from '../components/home/Home.module.sass'

import WelcomeSection from '../components/home/WelcomeSection'
import CVSection from '../components/home/CVSection'
import ThreeJSSection from '../components/home/ThreeJSSection'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Weilue's Place</title>
        <meta name="description" content="Weilue Luo's Personal Website." />
        <link rel="icon" href="/icons/favicon-32x32.png" />
      </Head>

      <main className={styles.main}>
        {/* <WelcomeSection/>
        <CVSection /> */}
        <ThreeJSSection />
      </main>
    </div>
  )
}
