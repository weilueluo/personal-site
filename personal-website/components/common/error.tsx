import { IoArrowRedoCircle } from "react-icons/io5/index";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Sorry something went wrong...</h1>
            <h3>{error.message}</h3>
            <button onClick={reset} className="std-hover std-pad icon-text">
                <IoArrowRedoCircle />
                <span>Try again</span>
            </button>
        </div>
    );
}
