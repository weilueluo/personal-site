"use client"

export default function Error({ error, reset }: any) {

    console.log("anime parent error", error);
    

    return (
        <div>
            <span>Something went wrong...</span>
            <span>Error</span>
            <span>{error}</span>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
