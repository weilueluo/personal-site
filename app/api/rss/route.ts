import Parser from "rss-parser";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const parser = new Parser();
const MAX_ERROR_BODY_PREVIEW_BYTES = 8 * 1024;
const DEFAULT_FETCH_TIMEOUT_MS = 15_000;
const FETCH_TIMEOUT_MS = (() => {
    const raw = process.env.RSS_FETCH_TIMEOUT_MS;
    if (!raw) return DEFAULT_FETCH_TIMEOUT_MS;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_FETCH_TIMEOUT_MS;
})();
const RSS_ACCEPT_HEADER =
    "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, text/html;q=0.8, */*;q=0.7";

function isValidUrl(url: string) {
    return /^https?:\/\//i.test(url);
}

function stripCdata(value: string) {
    const trimmed = value.trim();
    if (trimmed.startsWith("<![CDATA[") && trimmed.endsWith("]]>")) {
        return trimmed.slice("<![CDATA[".length, -"]]>".length).trim();
    }
    return trimmed;
}

function titleFromUrl(loc: string) {
    try {
        const u = new URL(loc);
        const path = u.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
        if (!path) return u.hostname;

        const decoded = decodeURIComponent(path);
        const words = decoded
            .split(/[/-]+/g)
            .filter(Boolean)
            .slice(-8)
            .map(w => w.replace(/\.[a-z0-9]+$/i, ""));

        return words
            .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
            .join(" ");
    } catch {
        return loc;
    }
}

function parseSitemapXml(xml: string, sourceUrl: string, limit = 50) {
    const items: Array<{
        title?: string;
        link?: string;
        guid?: string;
        pubDate?: string;
        isoDate?: string;
    }> = [];

    const urlBlockRe = /<url>([\s\S]*?)<\/url>/gi;
    let match: RegExpExecArray | null;
    while ((match = urlBlockRe.exec(xml)) && items.length < limit) {
        const block = match[1];
        const locMatch = block.match(/<loc>\s*([\s\S]*?)\s*<\/loc>/i);
        if (!locMatch) continue;
        const loc = stripCdata(locMatch[1]);
        if (!loc) continue;

        const lastmodMatch = block.match(/<lastmod>\s*([^<]+)\s*<\/lastmod>/i);
        const lastmod = lastmodMatch?.[1]?.trim();

        items.push({
            title: titleFromUrl(loc),
            link: loc,
            guid: loc,
            pubDate: lastmod || undefined,
            isoDate: lastmod || undefined,
        });
    }

    const origin = (() => {
        try {
            return new URL(sourceUrl).origin;
        } catch {
            return sourceUrl;
        }
    })();
    const hostname = (() => {
        try {
            return new URL(origin).hostname;
        } catch {
            return origin;
        }
    })();

    return {
        title: hostname,
        link: origin,
        description: `Sitemap-based feed for ${hostname}`,
        lastBuildDate: items[0]?.isoDate,
        items,
    };
}

async function readResponseTextPreview(res: Response, maxBytes: number) {
    const reader = res.body?.getReader();
    if (!reader) {
        return { preview: "", truncated: false };
    }

    const decoder = new TextDecoder();
    let bytesRead = 0;
    const chunks: string[] = [];

    while (bytesRead < maxBytes) {
        const { done, value } = await reader.read();
        if (done) {
            chunks.push(decoder.decode());
            return { preview: chunks.join(""), truncated: false };
        }
        if (!value) continue;

        const remaining = maxBytes - bytesRead;
        if (value.byteLength > remaining) {
            chunks.push(decoder.decode(value.subarray(0, remaining), { stream: true }));
            chunks.push(decoder.decode());
            try {
                await reader.cancel();
            } catch {
                // ignore
            }
            return { preview: chunks.join(""), truncated: true };
        }

        bytesRead += value.byteLength;
        chunks.push(decoder.decode(value, { stream: true }));
    }

    chunks.push(decoder.decode());

    // We hit the limit exactly; read one more chunk to know if there is more.
    try {
        const { done } = await reader.read();
        if (!done) {
            try {
                await reader.cancel();
            } catch {
                // ignore
            }
            return { preview: chunks.join(""), truncated: true };
        }
    } catch {
        // ignore
    }

    return { preview: chunks.join(""), truncated: false };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }
    if (!isValidUrl(url)) {
        return NextResponse.json({ error: "Invalid url parameter" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "personal-website-rss/1.0",
                Accept: RSS_ACCEPT_HEADER,
            },
            signal: controller.signal,
            next: {
                revalidate: 60 * 10,
            },
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            const { preview, truncated } = await readResponseTextPreview(res, MAX_ERROR_BODY_PREVIEW_BYTES);
            return NextResponse.json(
                {
                    error: "RSS fetch failed",
                    status: res.status,
                    statusText: res.statusText,
                    contentType,
                    bodyPreview: preview,
                    bodyTruncated: truncated,
                },
                { status: res.status }
            );
        }

        const xml = await res.text();
        if (/<urlset\b/i.test(xml)) {
            return NextResponse.json(parseSitemapXml(xml, url), {
                headers: {
                    "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
                },
            });
        }
        try {
            const feed = await parser.parseString(xml);
            return NextResponse.json(feed, {
                headers: {
                    "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
                },
            });
        } catch (error) {
            const contentType = res.headers.get("content-type");
            const bodyPreview = xml.slice(0, MAX_ERROR_BODY_PREVIEW_BYTES);
            const bodyTruncated = xml.length > MAX_ERROR_BODY_PREVIEW_BYTES;
            return NextResponse.json(
                {
                    error: "RSS parse failed",
                    detail: error instanceof Error ? error.message : String(error),
                    contentType,
                    bodyPreview,
                    bodyTruncated,
                },
                { status: 502 }
            );
        }
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (err.name === "AbortError") {
            return NextResponse.json(
                {
                    error: "RSS fetch failed",
                    status: 504,
                    detail: `Timeout after ${FETCH_TIMEOUT_MS}ms`,
                    causeCode: "TIMEOUT",
                },
                { status: 504 }
            );
        }
        const cause = (err as unknown as { cause?: unknown }).cause;

        const causeCode =
            typeof (cause as { code?: unknown } | null)?.code === "string"
                ? (cause as { code: string }).code
                : undefined;
        const causeMessage =
            typeof (cause as { message?: unknown } | null)?.message === "string"
                ? (cause as { message: string }).message
                : undefined;

        const detail =
            causeCode || causeMessage
                ? `${causeCode || ""}${causeCode && causeMessage ? ": " : ""}${causeMessage || ""}`
                : err.message;

        return NextResponse.json(
            {
                error: "RSS fetch failed",
                status: 502,
                detail,
                causeCode,
            },
            { status: 502 }
        );
    } finally {
        clearTimeout(timeoutId);
    }
}
