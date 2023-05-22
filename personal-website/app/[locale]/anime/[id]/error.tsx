"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <h1>Something went wrong...</h1>
            <h3>{error.message}</h3>
            <button onClick={reset}>Try again</button>
        </div>
    );
}