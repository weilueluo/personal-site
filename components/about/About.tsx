import { getBuildTime, timeSince } from "../utils/utils";
import styles from './About.module.sass'

const iconSize = 48;

function IconListItem(props) {
    const caption = <span>{props.caption}</span>
    return (
        <a href={props.url} className={styles['list-item-link']}>
            <li className={styles['list-item']}>
                    <img src={props.src} height={iconSize} width={iconSize} alt={`${props.caption} icon`}/>
            </li>
            {props.caption && caption}
        </a>

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
    const buildTime = new Date(getBuildTime());
    
    return (
        <span className={styles['build-time']}>
            This website is updated {timeSince(new Date(), buildTime)} ago.<br /> 
            Build time: {buildTime.toLocaleString()}.
        </span>
    )
}

IconListItem.defaultProps = {
    url: '#',
}

export default function About() {
    return (
        <>
            <div className={styles['container']}>
                {/* <UnderDevelopment /> */}

                {/* <Title>About</Title> */}

                <SubTitle>tech stack</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/javascript.svg" url="https://www.javascript.com/"/>
                    <IconListItem src="/icons/tech/typescript.svg" url="https://www.typescriptlang.org/"/>
                    <IconListItem src="/icons/tech/react.svg" url="https://reactjs.org/"/>
                    <IconListItem src="/icons/tech/threejs.svg" url="https://threejs.org/"/>
                    <IconListItem src="/icons/tech/nextdotjs.svg" url="https://nextjs.org/"/>
                    <IconListItem src="/icons/tech/sass.svg" url="https://sass-lang.com/"/>
                </List>

                <SubTitle>deployment</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/amazonaws.svg" url="https://aws.amazon.com/"/>
                </List>

                <SubTitle>source code</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/github.svg" url="https://github.com/Redcxx/personal-website"/>
                </List>

                <SubTitle>contact</SubTitle>
                <List>
                    <IconListItem src="/icons/tech/gmail.svg" url="mailto:luoweilue@gmail.com" caption="luoweilue@gmail.com"/>
                </List>
            </div>

            {/* Note this cause render content between server and client to differ */}
            <BuildTime />
        </>
    )
}

// export async function getStaticProps() {
//    const buildTime = 

//     return {
//       props: {
//         buildTime,
//       },
//     }
//   }