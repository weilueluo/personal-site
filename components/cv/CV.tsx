import { useEffect, useState } from 'react';
import styles from './CV.module.sass';

export default function CV(props) {

    const [postprocessed, setPostProcessed] = useState(false);

    // some post processing to resume.html
    useEffect(() => {
        if (postprocessed) {
            return;
        } else {
            setPostProcessed(true);
        }

        const cv = document.querySelector('#cv');

        // create header
        // create title
        const title = document.createElement('span');
        title.textContent = 'Weilue Luo' // change 'Weilue Luo CV' to 'Weilue Luo'
        const titleLink: HTMLAnchorElement = document.createElement('a');
        titleLink.href = window.location.protocol + "//" + window.location.host
        titleLink.insertBefore(title, null);
        // create view in github button
        const viewInGithubButton: HTMLButtonElement = document.createElement('button');
        viewInGithubButton.textContent = 'View In Github';
        const viewInGithubLink: HTMLAnchorElement = document.createElement('a');
        viewInGithubLink.href = 'https://github.com/Redcxx/cv/blob/master/resume.pdf'
        viewInGithubLink.insertBefore(viewInGithubButton, null);
        // create download button
        const downloadButton: HTMLButtonElement = document.createElement('button');
        downloadButton.textContent = 'Download';
        const downloadLink: HTMLAnchorElement = document.createElement('a');
        downloadLink.insertBefore(downloadButton, null);
        downloadLink.href = 'https://github.com/Redcxx/cv/raw/master/resume.pdf'

        // remove original header
        cv.children[0].remove();

        // create new header
        const header = document.createElement('p');
        header.insertBefore(viewInGithubLink, null);
        header.insertBefore(titleLink, null);
        header.insertBefore(downloadLink, null);
        // insert header into cv
        cv.insertBefore(header, cv.children[0]);

        // add contact info section
        const phoneSpan: HTMLSpanElement = document.createElement('span');
        phoneSpan.textContent = '(+44) 07543295595'
        const phoneLink: HTMLAnchorElement = document.createElement('a');
        phoneLink.href = 'tel:+4407543295595'
        phoneLink.insertBefore(phoneSpan, null);

        const emailSpan: HTMLSpanElement = document.createElement('span');
        emailSpan.textContent = 'work.luoweilue@gmail.com'
        const emailLink: HTMLAnchorElement = document.createElement('a');
        emailLink.href = 'mailto:work.luoweilue@gmail.com'
        emailLink.insertBefore(emailSpan, null);

        const githubSpan: HTMLSpanElement = document.createElement('span');
        githubSpan.textContent = 'Redcxx'
        const githubLink: HTMLAnchorElement = document.createElement('a');
        githubLink.href = 'https://github.com/redcxx'
        githubLink.insertBefore(githubSpan, null);

        const websiteSpan: HTMLSpanElement = document.createElement('span');
        websiteSpan.textContent = 'weilueluo.com'
        const websiteLink: HTMLAnchorElement = document.createElement('a');
        websiteLink.href = 'https://weilueluo.com'
        websiteLink.insertBefore(websiteSpan, null);

        const contactDiv: HTMLSpanElement = document.createElement('span');
        header.parentNode.insertBefore(contactDiv, header.nextSibling);
        contactDiv.insertBefore(phoneLink, null);
        contactDiv.insertBefore(emailLink, null);
        contactDiv.insertBefore(githubLink, null);
        contactDiv.insertBefore(websiteLink, null);

    }, [postprocessed])


    return (
        <>
            {/* <UnderDevelopment /> */}

            <div id='cv' className={styles['cv']} dangerouslySetInnerHTML={{ __html: props.cvContent }}></div>
        </>
    )
}



