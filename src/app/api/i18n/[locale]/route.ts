import { NextRequest } from "next/server";

interface Params {
    locale: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
    const res = await import(`@/public/messages/${context.params.locale}.json`);
    const minifiedJson = JSON.stringify(res);

    return new Response(minifiedJson);
}
