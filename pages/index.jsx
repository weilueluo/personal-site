import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import NavHeader from '../components/NavHeader'

import mirai from '../public/images/mirai.png'

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>Weilue's Place</title>
        <meta name="description" content="Weilue Luo's Personal Website." />
        <link rel="icon" href="/icons/favicon-32x32.png" />
      </Head>


      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeSectionDescription}>
            <h1>
              Welcome to<br /> 
              <a href="/">Weilue's Place</a>
            </h1>
            <p>A Computer Graphics Student at UCL.</p>
          </div>
          <div className={styles.welcomeSectionImageContainer}>
            <Image className={styles.welcomeSectionImage} src={mirai} alt="Mirai Image" />
          </div>
        </section>

        <NavHeader/>

        <Image className={styles.welcomeSectionImage} src={mirai} alt="Mirai Image" />

      </main>
    </div>
  )
}
