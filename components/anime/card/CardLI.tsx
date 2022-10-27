import { ComponentPropsWithoutRef, createContext, DOMAttributes, isValidElement, useContext } from "react";
import { mergeStyles } from "../../common/styles";

import styles from './CardLI.module.sass'

export const CardStyleContext = createContext(undefined);
export const CardImageStyleContext = createContext(undefined);
export const CardImageContainerStyleContext = createContext(undefined);
export const CardLinkStyleContext = createContext(undefined);
export const CardTitleStyleContext = createContext(undefined);

export interface CardProps extends ComponentPropsWithoutRef<'li'> {
    imageUrl: string,
    cardTitle?: JSX.Element | string,
    alt?: string,
    href?: string,
    imageProps?: ComponentPropsWithoutRef<'img'>,
    titleProps?: ComponentPropsWithoutRef<'span'>,
}

export default function Card({
    imageUrl,
    cardTitle = undefined,
    alt = undefined,
    href = undefined, // use this instead of '#' or '' to avoid unexpected behaviours https://stackoverflow.com/questions/5637969/is-an-empty-href-valid
    imageProps = undefined,
    titleProps = undefined,
    ...otherProps
}: CardProps) {

    alt = alt || 'Card Image'
    imageProps = imageProps || {}
    titleProps = titleProps || {}

    const cardStyle = mergeStyles(styles.card, useContext(CardStyleContext));
    const imageStyle = mergeStyles(styles.image, useContext(CardImageStyleContext));
    const imageContainerStyle = mergeStyles(styles.imageContainer, useContext(CardImageContainerStyleContext));
    const titleStyle = mergeStyles(styles.title, useContext(CardTitleStyleContext));
    const linkStyle = mergeStyles(styles.link, useContext(CardLinkStyleContext));

    return (
        <li className={cardStyle} {...otherProps}>
            <div className={imageContainerStyle}>
                <a className={linkStyle} href={href} onClick={e => !href && e.preventDefault()}>
                    <img src={imageUrl} alt={alt} className={imageStyle} {...imageProps} />
                </a>
            </div>
            {cardTitle && <span className={titleStyle} {...titleProps}>{cardTitle}</span>}
        </li>
    )
}