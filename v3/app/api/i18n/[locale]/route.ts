import { NextRequest } from "next/server";
import path from "path";

interface Params {
    locale: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
    const reqUrl = process.env.NEXT_PUBLIC_SITE_URL! + path.join("/messages", context.params.locale + ".json");
    const res = await fetch(reqUrl).then(res => res.json());
    const minifiedJson = JSON.stringify(res);

    return new Response(minifiedJson);
}
