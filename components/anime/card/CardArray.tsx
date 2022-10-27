import { ComponentPropsWithoutRef, createContext, useContext } from "react";
import { mergeStyles } from "../../common/styles";
import styles from './CardArray.module.sass'

export const CardArrayStyleContext = createContext(undefined);

export interface CardArrayProps extends ComponentPropsWithoutRef<'ul'> {
    expand: boolean
}

export default function CardArray(props: CardArrayProps) {

    const {expand, children, ...otherProps} = props;

    const listStyle = mergeStyles(styles.cardArray, !expand && styles.collapse, useContext(CardArrayStyleContext));

    return (
        <ul className={listStyle} {...otherProps}>
            {children}
        </ul>
    )
}