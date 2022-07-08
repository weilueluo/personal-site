import UnderDevelopment from "../common/UnderDevelopment";
import { getBuildTime } from "../utils/utils";
import styles from './About.module.sass'

const iconSize = 48;

function IconListItem(props) {
    const caption = <span>{props.caption}</span>
    return (
        <li className={styles['list-item']}>
            <a href={props.url}>
                <img src={props.src} height={iconSize} width={iconSize}/>
                {props.caption && caption}
            </a>
        </li>
    )
}

function Title(props) {
    return (
        <h1 className={styles['title']}>{props.children}</h1>
    )
}

function SubTitle(props) {
    return (
        <h2 className={styles['sub-title']}>{props.children}</h2>
    )
}

function List(props) {
    return (
        <ul className={styles['list']}>{props.children}</ul>
    )
}

function BuildTime() {
    return (
        <span className={styles['build-time']}>last updated {getBuildTime()}</span>
    )
}

IconListItem.defaultProps = {
    url: '#',
}

export default function About() {
    return (
        <>
            <div className={styles['container']}>
                <UnderDevelopment />

                <Title>About Page</Title>

                <SubTitle>built with</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/javascript.svg" url="https://www.javascript.com/"/>
                    <IconListItem src="/icons/tech/typescript.svg" url="https://www.typescriptlang.org/"/>
                    <IconListItem src="/icons/tech/react.svg" url="https://reactjs.org/"/>
                    <IconListItem src="/icons/tech/nextdotjs.svg" url="https://nextjs.org/"/>
                    <IconListItem src="/icons/tech/sass.svg" url="https://sass-lang.com/"/>
                </List>

                <SubTitle>deployed with</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/amazonaws.svg" url="https://aws.amazon.com/"/>
                </List>

                <SubTitle>open source on</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/github.svg" url="https://github.com/Redcxx/personal-website"/>
                </List>

                <SubTitle>contact me</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/gmail.svg" url="mailto:luoweilue@gmail.com" caption="luoweilue@gmail.com"/>
                </List>

            </div>

            <BuildTime/>
        </>
    )
}

// export async function getStaticProps() {
//    const dateTimeStamp = 

//     return {
//       props: {
//         dateTimeStamp,
//       },
//     }
//   }