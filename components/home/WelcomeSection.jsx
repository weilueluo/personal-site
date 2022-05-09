import Image from 'next/image'
import kazuha from '../../public/images/kazuha.png'
import styles from './WelcomeSection.module.sass'


export default function WelcomeSection() {
    return (
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeSectionDescription}>
            <h1>
              Welcome to<br /> 
              <a href="/">Weilue's Place</a>
            </h1>
            <p>A Computer Graphics Student at UCL.</p>
          </div>
          <div className={styles.welcomeSectionImageContainer}>
            <Image className={styles.welcomeSectionImage} src={kazuha} layout="intrinsic" alt="kazuha image" />
          </div>
        </section>
    )
}