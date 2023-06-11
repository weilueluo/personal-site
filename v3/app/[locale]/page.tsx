import CanvasLayout from "@/components/three/layout";
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
            <div className="std-bg flex h-full w-full flex-col items-center justify-center">
                <h3>
                    <FormattedMessage messages={messages} id="index.title" />
                </h3>
                <MyRoom />
            </div>
        </CanvasLayout>
    );
}
