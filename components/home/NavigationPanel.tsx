import { useEffect, useState, MouseEvent } from "react";
import { getDeviceDependent } from "../utils/hooks";
import { isDevEnv } from "../utils/utils";

import styles from './NavigationPanel.module.sass'


type NavItem = {
    name: string,
    link: string
}

const navItems: NavItem[] = [
    {
        name: 'CV',
        link: '/cv'
    },
    {
        name: 'RSS',
        link: '/rss'
    }, 
    {
        name: 'About',
        link: '/about'
    },
    {
        name: 'Anime',
        link: '/anime'
    }
]

export default function NavigationPanel() {

    const [isMobile, setIsMobile] = useState(false);
    const [active, setActive] = useState(false);
    const [panelItems, setPanelItems] = useState([])
    const [iconSrc, setIconSrc] = useState('')

    useEffect(() => {
        const isMobile = getDeviceDependent(true, false);
        // console.log(isMobile);
        
        setIsMobile(isMobile)
        setActive(!isMobile)
    }, [])

    useEffect(() => {
        const panelItems = []
        if (active){
            navItems.forEach(item => {
                panelItems.push(<PanelItem key={item.name} {...item} />)
            })
        }
        setPanelItems(panelItems)
    }, [active])

    useEffect(() => {
        setIconSrc(active ? '/icons/misc/xmark-solid.svg' : '/icons/misc/grip-lines-solid.svg')
    }, [active])

    const onClick = () => setActive(!active);

    return (
        <div className={`${styles['nav-panel']} ${active ? styles['nav-active']: ''}  ${isMobile ? styles['mobile']: ''}`} onClick={onClick}>
            <img className={styles['nav-icon']} src={iconSrc} alt={`${iconSrc} icon`}/>
            {active && panelItems}
        </div>
    )
}

function PanelItem(props: NavItem) {

    let link = props.link || '';
    if (!isDevEnv() && link.startsWith('/')) {
        link = link + '.html'
    }

    const onClick = (e: MouseEvent<HTMLButtonElement>) => {
        window.open(link, '_self');
        e.stopPropagation();
    }

    return (
        <button className={styles['nav-item']} onClick={onClick}>
            {props.name}
        </button>
    )
}