import { NextRequest } from "next/server";

interface Params {
    locale: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
    const { locale } = await context.params;
    const res = await import(`@/public/messages/${locale}.json`);
    const minifiedJson = JSON.stringify(res.default || res);

    return new Response(minifiedJson);
}
