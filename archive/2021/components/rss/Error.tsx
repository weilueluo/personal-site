import { type ReactElement } from 'react';
import styles from './Error.module.sass'
import { RSSRequestError } from './RSS.d';

type RSSErrorsProps = {
    errors: RSSRequestError[];
};

type RSSErrorProps = {
    error: RSSRequestError;
};

export default function RSSErrors(props: RSSErrorsProps) {
    const errors: RSSRequestError[] = props.errors

    const errorJsxs: ReactElement[] = []

    if (errors.length == 0) {
        errorJsxs.push(<RSSNoError key={'no-error'} />)
    } else {
        errors.forEach(error => {
            errorJsxs.push(<RSSError key={error.url} error={error} />)
        });
    }

    return <ul className={styles['errors-container']}>{errorJsxs}</ul>
}

 function RSSNoError() {
    return (
        <li key={"no-error"} className={styles['no-error']}>
            <span className={styles['message']}>{"No Error"}</span>
        </li>
    )
}

function RSSError(props: RSSErrorProps) {
    const error = props.error;

    const urlOnClick = () => {
        window.open(error.url, '_blank')
    }

    return (
        <li key={error.url} className={styles['error']}>
            <span className={styles['url']} onClick={() => urlOnClick()}>{error.url}</span>
            <span className={styles['message']}>{error.message}</span>
            <span className={styles['stack']}>{error.stack}</span>
        </li>
    )
} 
