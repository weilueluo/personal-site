import { RSSRequestError } from './RSS.d';


export default function RSSErrors(props: any) {
    const errors: RSSRequestError[] = props.errors

    const errorJsxs = []

    if (errors.length == 0) {
        errorJsxs.push(<RSSNoError key={'no-error'} />)
    } else {
        errors.forEach(error => {
            errorJsxs.push(<RSSError key={error.url} error={error} />)
        });
    }

    return <ul className=' w-full max-w-full flex items-center list-none flex-col pl-0 gap-4'>{errorJsxs}</ul>
}

 function RSSNoError() {
    return (
        <li key={"no-error"} className='w-96 max-w-full flex flex-col items-center justify-center gap-2 px-2 py-3 bg-green-400 border border-r-3'>
            <span className=' italic text-black'>{"No Error"}</span>
        </li>
    )
}

function RSSError(props: any) {
    const error = props.error;

    const urlOnClick = () => {
        window.open(error.url, '_blank')
    }

    return (
        <li key={error.url} className='w-96 max-w-full flex flex-col items-center justify-center gap-2 px-2 py-3 bg-red-400 border border-r-3'>
            <span className=' text-base' onClick={() => urlOnClick()}>{error.url}</span>
            <span className=' italic text-black'>{error.message}</span>
            <span className={styles.stack}>{error.stack}</span>
        </li>
    )
} 