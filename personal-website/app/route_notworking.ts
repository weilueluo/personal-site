import { DEFAULT_LOCALE } from "@/shared/i18n/settings";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
}
