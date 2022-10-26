
import { ComponentPropsWithoutRef, createContext, useContext, useEffect, useState } from 'react';
import { mergeStyles } from '../../common/styles';
import styles from './button.module.sass';

export const BinaryButtonStyleContext = createContext(undefined);

export interface BinaryButtonProps extends ComponentPropsWithoutRef<'button'> {
    binary: boolean,
    trueText: string,
    falseText: string,
}

export default function BinaryButton({
    binary,
    trueText,
    falseText,
    ...otherProps
}: BinaryButtonProps) {

    const [displayText, setDisplayText] = useState('');
    useEffect(() => setDisplayText(binary ? trueText : falseText), [binary, trueText, falseText]);
    const buttonStyle = mergeStyles(
        styles.binaryButton, 
        binary && styles.buttonTrue, 
        !binary && styles.buttonFalse, 
        useContext(BinaryButtonStyleContext)
    )

    return <button className={buttonStyle} {...otherProps}>{displayText}</button>
}