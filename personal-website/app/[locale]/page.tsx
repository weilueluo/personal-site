import { MyRoom } from "@/components/locale/my-room";
import CanvasLayout from "@/components/three/layout";
import { FormattedMessage, fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";

export default async function Page({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    return (
        <CanvasLayout>
            <div className="flex h-full w-full flex-col items-center justify-center dark:bg-gray-300">
                <h3>
                    <FormattedMessage messages={messages} id="index.title" />
                </h3>
                <MyRoom />
            </div>
        </CanvasLayout>
    );
}
