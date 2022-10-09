import styles from './CV.module.sass'
import { useEffect, useState } from 'react'

export default function CV(props) {

    const viewInGithub = () => {
        window.open('https://github.com/Redcxx/cv/blob/master/resume.pdf', '_self');
    }

    const download = () => {
        window.open('https://github.com/Redcxx/cv/raw/master/resume.pdf', '_self');
    }

    const [postprocessed, setPostProcessed] = useState(false);

    // some post processing to resume.html
    useEffect(() => {
        if (postprocessed) {
            return;
        } else {
            setPostProcessed(true);
        }

        const cv = document.querySelector('#cv');

        // modify header
        const header = cv.children[0];
        header.children[0].remove()  // remove date
        const title = header.children[0];
        title.textContent = 'Weilue Luo' // change 'Weilue Luo CV' to 'Weilue Luo'
        // add view in github button
        const viewInGithubButton: HTMLButtonElement = document.createElement('button');
        viewInGithubButton.textContent = 'View In Github';
        viewInGithubButton.addEventListener('click', viewInGithub);
        title.parentNode.insertBefore(viewInGithubButton, title);
        // add download button
        const downloadButton: HTMLButtonElement = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', download);
        title.parentNode.insertBefore(downloadButton, title.nextSibling);

        // add contact info section
        const phoneSpan: HTMLSpanElement = document.createElement('span');
        phoneSpan.textContent = '(+44) 07543295595'

        const emailSpan: HTMLSpanElement = document.createElement('span');
        emailSpan.textContent = 'work.luoweilue@gmail.com'

        const githubSpan: HTMLSpanElement = document.createElement('span');
        githubSpan.textContent = 'Redcxx'

        const websiteSpan: HTMLSpanElement = document.createElement('span');
        websiteSpan.textContent = 'https://weilueluo.com'

        const contactDiv: HTMLSpanElement = document.createElement('span');
        header.parentNode.insertBefore(contactDiv, header.nextSibling);
        contactDiv.insertBefore(phoneSpan, null);
        contactDiv.insertBefore(emailSpan, null);
        contactDiv.insertBefore(githubSpan, null);
        contactDiv.insertBefore(websiteSpan, null);

    }, [postprocessed])


    return (
        <>
            {/* <UnderDevelopment /> */}

            <div id='cv' className={styles['cv']} dangerouslySetInnerHTML={{__html: props.cvContent}}></div>
        </>
    )
}



