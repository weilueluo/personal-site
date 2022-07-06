import UnderDevelopment from "../common/UnderDevelopment";



const iconSize = 48;

function IconListItem(props) {
    const caption = <span>{props.caption}</span>
    return (
        <li>
            <a href={props.url}>
                <img src={props.src} height={iconSize} width={iconSize}/>
                {props.caption && caption}
            </a>
        </li>
    )
}

IconListItem.defaultProps = {
    url: '#',
}

export default function About() {

    return (
        <div className="all-container">
            <UnderDevelopment />

            <h1>Hello This is an \ ABOUT \ page</h1>
            <h2>This website is \ CREATED \ by \ WEILUE LUO \</h2>

            <h3>This website is \ BUILT \ with:</h3>
            <ul>
                <IconListItem src="/icons/tech/javascript.svg" url="https://www.javascript.com/"/>
                <IconListItem src="/icons/tech/typescript.svg" url="https://www.typescriptlang.org/"/>
                <IconListItem src="/icons/tech/react.svg" url="https://reactjs.org/"/>
                <IconListItem src="/icons/tech/nextdotjs.svg" url="https://nextjs.org/"/>
                <IconListItem src="/icons/tech/sass.svg" url="https://sass-lang.com/"/>
                
            </ul>

            <h3>This website is \ DEPLOYED \ with:</h3>
            <ul>
                <IconListItem src="/icons/tech/amazonaws.svg" url="https://aws.amazon.com/"/>
            </ul>

            <h3>This website is \ OPEN SOURCE \ on:</h3>
            <ul>
                <IconListItem src="/icons/tech/github.svg" url="https://github.com/Redcxx/personal-website"/>
            </ul>

            <h3>You can \ CONTACT \ using:</h3>
            <ul>
                <IconListItem src="/icons/tech/gmail.svg" url="mailto:luoweilue@gmail.com" caption="luoweilue@gmail.com"/>
            </ul>
        </div>
    )
}