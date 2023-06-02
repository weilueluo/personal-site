import CanvasLayout from "@/components/three/layout";
import { MyRoom } from "./my-room";
import Title from "./title";

export default function Page() {
    return (
        <CanvasLayout>
            <div className="flex h-full w-full flex-col items-center justify-center dark:bg-gray-300">
                <Title />
                <MyRoom />
            </div>
        </CanvasLayout>
    );
}
