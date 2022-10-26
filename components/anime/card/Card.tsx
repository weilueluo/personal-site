import { ComponentPropsWithoutRef, createContext, DOMAttributes, useContext } from "react";
import { mergeStyles } from "../../common/styles";

import styles from './card.module.sass'

export const CardStyleContext = createContext(undefined);
export const CardImageStyleContext = createContext(undefined);
export const CardLinkStyleContext = createContext(undefined);
export const CardTitleStyleContext = createContext(undefined);

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
    imageUrl: string,
    title?: string,
    alt?: string,
    href?: string,
    imageProps?: ComponentPropsWithoutRef<'img'>,
    titleProps?: ComponentPropsWithoutRef<'span'>,
}

export default function Card({
    imageUrl,
    title = undefined,
    alt = undefined,
    href = undefined, // use this instead of '#' or '' to avoid unexpected behaviours https://stackoverflow.com/questions/5637969/is-an-empty-href-valid
    imageProps = undefined,
    titleProps = undefined,
    ...otherProps
}: CardProps) {

    alt = alt || 'Card Image'
    href = href || 'javascript:void(0)'
    imageProps = imageProps || {}
    titleProps = titleProps || {}

    const cardStyle = mergeStyles(styles.card, useContext(CardStyleContext));
    const imageStyle = mergeStyles(styles.image, useContext(CardImageStyleContext));
    const titleStyle = mergeStyles(styles.title, useContext(CardTitleStyleContext));
    const linkStyle = mergeStyles(styles.link, useContext(CardLinkStyleContext));

    return (
        <div className={cardStyle} {...otherProps}>
            <a className={linkStyle} href={href}>
                <img src={imageUrl} alt={alt} className={imageStyle} {...imageProps}/>
            </a>
            {title && <span className={titleStyle} {...titleProps}>{title}</span>}
        </div>
    )
}