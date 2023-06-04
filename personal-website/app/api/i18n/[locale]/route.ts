import { getPublicFolderPath } from "@/shared/utils";
import fs from "fs";
import { NextRequest } from "next/server";
import path from "path";

interface Params {
    locale: string;
}

export const revalidate = 60 * 10;

export async function GET(request: NextRequest, context: { params: Params }) {
    const dir = path.join(getPublicFolderPath(), "messages", context.params.locale + ".json");

    const json = fs.readFileSync(dir, "utf-8");

    const minifiedJson = JSON.stringify(JSON.parse(json));

    return new Response(minifiedJson);
}
