
import { useState, useEffect } from 'react'
import styles from './Content.module.sass'
import { getNScrollPages } from './scene/global'

export default function Content() {

    const [pages, setPages] = useState(1)

    useEffect(() => {
        setPages(getNScrollPages())
    }, [])

    // <section className={styles.titleSection}>
    //                 <div className={styles.header}>
    //                     <h2>{'Hello I\'m Weilue'}</h2>
    //                     {/* <span>I am Weilue</span> */}
    //                 </div>
    //             </section>
    
    return (
        <>
            <div className={styles.contentContainer}>
                <div>
                    <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
                </div>
            </div>
        </>
    )
}