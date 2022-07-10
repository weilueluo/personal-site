import { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import styles from './RSS.module.sass'
import RSSLoader from './RSSLoader'
import UnderDevelopment from '../common/UnderDevelopment'


const rssLoader = new RSSLoader();

export default function RSS() {
    
    const [feed, setFeed] = useState([])

    useEffectOnce(() => {
        rssLoader.loadGithubFeed()
            .then(feed => {
                console.log('feed');
                console.log(feed);
                setFeed(feed);
            })
            .catch(error => {
                console.log('error');
                console.log(error);
            })
        // const text = rssLoader.loadGithubFeed()
        // console.log(text)
    })

    return (
        <>
            <UnderDevelopment/>
            <span>{feed}</span>
        </>
    )
}

