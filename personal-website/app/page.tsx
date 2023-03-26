import { DEFAULT_LOCALE } from "@/shared/i18n/settings";
import { default as LocalePage } from "./[locale]/page";


export default function Page(props: any) {
    // @ts-expect-error Async Server Component
    return <LocalePage {...props} params={{locale: DEFAULT_LOCALE}} />;
}
