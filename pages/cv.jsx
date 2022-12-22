import CV from '../components/cv/CV'
import Head from 'next/head'


export default function CVPage(props) {
    return (
        <>
            <Head>
                <title>Weilue&apos;s CV</title>
                <meta name="description" content="Weilue Luo&apos;s CV"/>
                <link rel="icon" href="/icons/favicon-32x32.png"/>
            </Head>

            <CV cvContent={props.cvContent}/>
        </>
    )
}


export async function getStaticProps() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const cvContent = fs.readFileSync('components/cv/resume.html', { encoding: 'utf-8'});

    return {
        props: {
            cvContent: cvContent
        }
    }
}