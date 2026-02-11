import { IoArrowRedoCircle } from "react-icons/io5";
import IconedText from "../ui/icon-text";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col gap-4 py-8">
            <h1 className="text-2xl font-bold">Sorry something went wrong...</h1>
            <h3 className="text-base">{error.message}</h3>
            <IconedText onClick={() => reset()}>
                <IoArrowRedoCircle />
                Try again
            </IconedText>
        </div>
    );
}
