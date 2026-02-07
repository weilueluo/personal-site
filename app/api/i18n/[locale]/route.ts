import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/constants";

interface Params {
    locale: string;
}

export async function GET(_request: Request, context: { params: Params }) {
    const { locale } = context.params;
    const safeLocale = LOCALES.includes(locale as (typeof LOCALES)[number]) ? locale : DEFAULT_LOCALE;

    try {
        const res = await import(`@/public/messages/${safeLocale}.json`);
        return NextResponse.json(res.default ?? res, {
            headers: {
                "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
            },
        });
    } catch {
        return NextResponse.json({ error: "Messages not found" }, { status: 404 });
    }
}
