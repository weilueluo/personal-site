import { NextRequest } from "next/server";
import path from "path";

interface Params {
    locale: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
    const reqUrl = path.join("http://localhost:3000/messages", context.params.locale + ".json");

    const res = await fetch(reqUrl).then(res => res.json());
    const minifiedJson = JSON.stringify(res);

    return new Response(minifiedJson);
}
