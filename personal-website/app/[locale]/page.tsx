import CanvasLayout from "@/components/three/layout";
import Title from "./title";
import { MyRoom } from "./my-room";
import { LOCALES } from "@/shared/constants";

export async function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

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
