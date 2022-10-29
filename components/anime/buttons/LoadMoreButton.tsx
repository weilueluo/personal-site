
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, createContext, useContext } from 'react';
import { mergeStyles } from '../../common/styles';
import styles from './button.module.sass';

export const LoadMoreButtonStyleContext = createContext(undefined);

export interface LoadMoreButtonProps extends ComponentPropsWithoutRef<'button'> {
    hasMore: boolean,
    loading: boolean
    loadMoreText?: string,
    allLoadedText?: string,
    loadingText?: string,
}

export default function LoadMoreButton({
    hasMore,
    loading,
    loadMoreText = 'load more',
    allLoadedText = 'all loaded',
    loadingText = 'loading',
    ...otherProps
}: LoadMoreButtonProps) {

    const displayText = loading ? loadingText : (hasMore ? loadMoreText : allLoadedText);

    const buttonStyle = mergeStyles(styles.loadMoreButton, !hasMore && styles.allLoaded, loading && styles.loading, useContext(LoadMoreButtonStyleContext));

    return <button className={buttonStyle} {...otherProps}>{displayText}</button>
}