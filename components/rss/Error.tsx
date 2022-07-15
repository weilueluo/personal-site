import styles from './Error.module.sass'


export default function RSSError(props) {
    const error = props.error

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

export function RSSNoError() {
    return (
        <li key={"noerror"} className={styles['no-error']}>
            <span className={styles['message']}>{"No Error"}</span>
        </li>
    )
}