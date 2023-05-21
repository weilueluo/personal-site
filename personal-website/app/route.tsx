import { DEFAULT_LOCALE } from "@/shared/constants";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const newUrl =
        request.nextUrl.origin +
        `/${DEFAULT_LOCALE}` +
        request.nextUrl.pathname +
        request.nextUrl.search +
        request.nextUrl.hash;

    return NextResponse.redirect(newUrl);
}
