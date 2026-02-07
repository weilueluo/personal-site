"use client";

import RSSProvider from "@/components/rss/manager";
import UserRSSConfigsProvider from "@/components/rss/user-config";
import { LOCALE_TYPE } from "@/shared/constants";
import { Messages } from "@/shared/i18n/type";
import RSS from "./rss";

export default function RSSClient({ messages, locale }: { messages: Messages; locale: LOCALE_TYPE }) {
    return (
        <RSSProvider>
            <UserRSSConfigsProvider>
                <RSS messages={messages} locale={locale} />
            </UserRSSConfigsProvider>
        </RSSProvider>
    );
}
