import CanvasLayout from "@/components/three/layout";
import "@/components/ui/board.scss";
import Loading from "@/components/ui/loading/spinner";
import { FormattedMessage, fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import dynamic from "next/dynamic";

const MyRoom = dynamic(() => import("@/components/locale/my-room"), {
    ssr: false,
    loading: () => <Loading />,
});

export default async function Page({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    return (
        <CanvasLayout>
            <div className="std-bg flex h-fit w-full flex-col items-center justify-center">
                <h3>
                    <FormattedMessage messages={messages} id="index.title" />
                </h3>

                <MyRoom />
                {/* 
                <div className="board-container h-96 w-[80%]">
                    <div className={tm("grid h-full w-full grid-cols-3 gap-6", "board")}>
                        {Array.from(Array(9)).map((_, i) => (
                            <div key={i} className=" board-item grid place-items-center">
                                <span>{i}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </CanvasLayout>
    );
}
