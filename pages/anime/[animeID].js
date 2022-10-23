import { useRouter } from 'next/router'
import fetchAllAnimeData from '../../components/animation/data'

export default function AnimeDetails() {

    const router = useRouter();
    const { animeID } = router.query;

    console.log(router);

    return (
        <></>
    )
}

export async function getStaticPaths() {
    return {
        paths: fetchAllAnimeData().then(datum => datum.map(data => {params: {animeID: data.id}}))
    }
}

export async function getStaticProps(context) {
    return {
        props:{}
    }
}