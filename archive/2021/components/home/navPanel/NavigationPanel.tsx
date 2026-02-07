import { type ReactElement, useEffect, useState, MouseEvent } from "react";

import styles from './NavigationPanel.module.sass'
import { getDeviceDependent, isDevEnv } from "../../common/misc";


type NavItem = {
    name: string,
    link: string
}

const navItems: NavItem[] = [
    {
        name: 'Older Site',
        link: '/archive/2019'
    },
    {
        name: 'Newer Site',
        link: '/archive/2021'
    },
    {
        name: 'Source',
        link: 'https://github.com/weilueluo/personal-site'
    }
]

export default function NavigationPanel() {

    const [isMobile, setIsMobile] = useState(false);
    const [active, setActive] = useState(false);
    const [panelItems, setPanelItems] = useState<ReactElement[]>([])
    const iconSrc = active ? '/icons/misc/xmark-solid.svg' : '/icons/misc/grip-lines-solid.svg'

    useEffect(() => {
        const isMobile = getDeviceDependent(true, false);
        // console.log(isMobile);
        
        setIsMobile(isMobile)
        setActive(!isMobile)
    }, [])

    useEffect(() => {
        const panelItems: ReactElement[] = []
        if (active){
            navItems.forEach(item => {
                panelItems.push(<PanelItem key={item.name} {...item} />)
            })
        }
        setPanelItems(panelItems)
    }, [active])

    const onClick = () => setActive(!active);

    return (
        <div className={`${styles['nav-panel']} ${active ? styles['nav-active']: ''}  ${isMobile ? styles['mobile']: ''}`} onClick={onClick}>
            {/* eslint-disable-next-line */}
            <img className={styles['nav-icon']} src={iconSrc} alt={`${iconSrc} icon`}/>
            {active && panelItems}
        </div>
    )
}

function PanelItem(props: NavItem) {

    let link = props.link || '';
    if (!isDevEnv() && link.startsWith('/') && !link.startsWith('/archive/')) {
        link = link + '.html'
    }

    const onClick = (e: MouseEvent<HTMLButtonElement>) => {
        window.open(link, '_self');
        e.stopPropagation();
    }

    return (
        <div className={styles['nav-item']}>
            <a className={styles['nav-a']} href={link}>
                <button className={styles['nav-button']} onClick={onClick}>
                    {props.name}
                </button>
            </a>
        </div>
    )
}
