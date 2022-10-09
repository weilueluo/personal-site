
import style from './CV.module.sass'
import { useEffect, useState } from 'react'

export default function CV(props) {

    const viewInGithub = () => {
        window.open('https://github.com/Redcxx/cv/blob/master/resume.pdf', '_self');
    }

    const download = () => {
        window.open('https://github.com/Redcxx/cv/raw/master/resume.pdf', '_self');
    }

    const [addedViewInGithubButton, setAddedViewInGithubButton] = useState(false);
    const [addedDownloadButton, setAddedDownloadButton] = useState(false);
    const [dateRemoved, setDateRemoved] = useState(false);

    // some post processing to resume.html
    useEffect(() => {
        // change title
        const title = document.querySelector('div>p>span:nth-child(2)');
        title.textContent = 'Weilue Luo'
        
        // remove date
        if (!dateRemoved) {
            const date = document.querySelector('div>p>span:nth-child(1)');
            date.remove()
            setDateRemoved(true);
        }
        
        // add view in github button
        if (!addedViewInGithubButton) {
            const viewInGithubButton: HTMLButtonElement = document.createElement('button');
            viewInGithubButton.textContent = 'View In Github';
            viewInGithubButton.addEventListener('click', viewInGithub);
            title.parentNode.insertBefore(viewInGithubButton, title);

            setAddedViewInGithubButton(true);
        }

        // add view in github button
        if (!addedDownloadButton) {
            const downloadButton: HTMLButtonElement = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', download);
            title.parentNode.insertBefore(downloadButton, title.nextSibling);
            setAddedDownloadButton(true);
        }
    }, [dateRemoved, addedViewInGithubButton, addedDownloadButton])


    return (
        <>
            {/* <UnderDevelopment /> */}

            <div className={style['cv']} dangerouslySetInnerHTML={{__html: props.cvContent}}></div>
        </>
    )
}



