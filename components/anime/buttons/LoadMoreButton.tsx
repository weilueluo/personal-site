
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, createContext, useContext } from 'react';
import { mergeStyles } from '../../common/styles';
import styles from './button.module.sass';

export const LoadMoreButtonStyleContext = createContext(undefined);

export interface LoadMoreButtonProps extends ComponentPropsWithoutRef<'button'> {
    hasMore: boolean,
    loadMoreText?: string,
    allLoadedText?: string
}

export default function LoadMoreButton({
    hasMore,
    loadMoreText = 'load more',
    allLoadedText = 'all loaded',
    ...otherProps
}: LoadMoreButtonProps) {

    const displayText = hasMore ? loadMoreText : allLoadedText;

    const buttonStyle = mergeStyles(styles.loadMoreButton, !hasMore && styles.allLoaded, useContext(LoadMoreButtonStyleContext));

    return <button className={buttonStyle} {...otherProps}>{displayText}</button>
}