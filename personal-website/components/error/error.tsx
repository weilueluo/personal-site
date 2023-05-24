export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <h1 className="text-2xl font-bold">Sorry something went wrong...</h1>
            <h3 className=" text-lg font-semibold">Will the below message help?</h3>
            <h3>{error.message}</h3>
            <h3 className=" text-lg font-semibold">Or try again?</h3>
            <button onClick={reset} className="px-2 py-1 bg-emerald-300">Try again</button>
        </div>
    );
}
