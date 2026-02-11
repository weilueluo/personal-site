import { NextResponse } from "next/server";

const GITHUB_REST_ENDPOINT = "https://api.github.com";
const OWNER = "weilueluo";
const REPO = "blogs";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function buildGithubContentsPath(path: string | null) {
    if (!path) {
        return "/contents";
    }
    const safePath = path
        .split("/")
        .map(segment => encodeURIComponent(segment))
        .join("/");
    return `/contents/${safePath}`;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const mode = searchParams.get("mode") ?? "contents";

    let url = "";
    if (mode === "commits") {
        if (!path) {
            return NextResponse.json(
                { error: "path is required for commits mode" },
                { status: 400 }
            );
        }
        const safePath = encodeURIComponent(path);
        url = `${GITHUB_REST_ENDPOINT}/repos/${OWNER}/${REPO}/commits?path=${safePath}`;
    } else {
        const contentsPath = buildGithubContentsPath(path);
        url = `${GITHUB_REST_ENDPOINT}/repos/${OWNER}/${REPO}${contentsPath}`;
    }

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
            "X-GitHub-Api-Version": "2022-11-28",
        },
        next: {
            revalidate: 60 * 10,
        },
    });

    if (!res.ok) {
        const body = await res.text();
        return NextResponse.json(
            {
                error: "GitHub request failed",
                status: res.status,
                body,
            },
            { status: res.status }
        );
    }

    const data = await res.json();
    return NextResponse.json(data, {
        headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" },
    });
}
