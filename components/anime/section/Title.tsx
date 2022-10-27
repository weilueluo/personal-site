import { ComponentPropsWithoutRef, createContext, useContext } from "react"
import { mergeStyles } from "../../common/styles"
import styles from './Title.module.sass'

export const SectionTitleStyle = createContext(undefined);

export interface SectionTitleProps extends ComponentPropsWithoutRef<'span'> {
    sectionTitle: string
}

export default function SectionTitle({
    sectionTitle,
    ...otherProps
}: SectionTitleProps) {

    const titleStyle = mergeStyles(styles.title, useContext(SectionTitleStyle))

    return <span className={titleStyle} {...otherProps}>{sectionTitle}</span>
}