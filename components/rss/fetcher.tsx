import { RSS_CONFIGS } from "./config";

type FeedItem = {
    title?: string;
    link?: string;
    guid?: string;
    summary?: string;
    content?: string;
    contentSnippet?: string;
    pubDate?: string;
    isoDate?: string;
};

type FeedResponse = {
    title?: string;
    link?: string;
    description?: string;
    lastBuildDate?: string;
    items?: FeedItem[];
};

type RssApiErrorResponse = {
    error?: unknown;
    status?: unknown;
    statusText?: unknown;
    detail?: unknown;
    contentType?: unknown;
    bodyPreview?: unknown;
    bodyTruncated?: unknown;
};

function toSingleLine(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function truncateEnd(value: string, maxLen: number) {
    if (value.length <= maxLen) return value;
    return value.slice(0, maxLen) + "...";
}

function looksLikeHtml(value: string) {
    const v = value.trimStart();
    return /^<!doctype html/i.test(v) || /^<html[\s>]/i.test(v) || /<html[\s>]/i.test(v);
}

function maybeShortReason(preview: string, contentType?: string | null) {
    const v = toSingleLine(preview);
    if (!v) return "";

    const ct = (contentType || "").toLowerCase();
    if (ct.includes("text/html") || looksLikeHtml(v)) return "";

    // Keep UI messages short; long bodies are noise.
    if (v.length <= 120) return v;
    return "";
}

function formatApiErrorMessage(status: number, statusText: string, payload: RssApiErrorResponse | null) {
    const errorText = typeof payload?.error === "string" ? payload.error : "RSS API error";
    const detail =
        typeof payload?.detail === "string" ? truncateEnd(toSingleLine(payload.detail), 200) : "";

    const upstreamContentType = typeof payload?.contentType === "string" ? payload.contentType : "";
    const bodyPreview = typeof payload?.bodyPreview === "string" ? payload.bodyPreview : "";
    const reason = detail || maybeShortReason(bodyPreview, upstreamContentType);

    const code = `${status}${statusText ? ` ${statusText}` : ""}`;
    return reason ? `${errorText} (${code}): ${reason}` : `${errorText} (${code})`;
}

function normalizeText(value?: string | null) {
    return value?.replace(/\s+/g, " ").trim() || "";
}

function normalizeHtml(value?: string | null) {
    return value?.trim() || "";
}

function getHtmlOrText(el?: Element | null) {
    if (!el) return "";
    return normalizeHtml(el.innerHTML) || normalizeText(el.textContent);
}

function toPlainText(html: string) {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return normalizeText(temp.textContent);
}

function extractLinkFromAtom(entry: Element) {
    const alternate = entry.querySelector('link[rel="alternate"]') || entry.querySelector("link");
    if (!alternate) return "";
    return (
        normalizeText(alternate.getAttribute("href")) ||
        normalizeText(alternate.textContent) ||
        ""
    );
}

function parseRssXml(xml: string): FeedResponse {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    const parserError = doc.querySelector("parsererror");
    if (parserError) {
        throw new Error("Invalid RSS XML");
    }

    const channel = doc.querySelector("channel");
    if (channel) {
        const title = normalizeText(channel.querySelector("title")?.textContent);
        const link = normalizeText(channel.querySelector("link")?.textContent);
        const description = normalizeText(channel.querySelector("description")?.textContent);
        const lastBuildDate = normalizeText(channel.querySelector("lastBuildDate")?.textContent);
        const items = Array.from(channel.querySelectorAll("item")).map(item => {
            const titleText = normalizeText(item.querySelector("title")?.textContent);
            const linkText = normalizeText(item.querySelector("link")?.textContent);
            const guidText =
                normalizeText(item.querySelector("guid")?.textContent) ||
                linkText ||
                titleText;
            const descriptionEl = item.querySelector("description");
            const summaryHtml = getHtmlOrText(descriptionEl);
            const contentEncoded =
                normalizeHtml(item.getElementsByTagName("content:encoded")?.[0]?.textContent) ||
                "";
            const contentHtml = contentEncoded || summaryHtml;
            const contentSnippet = toPlainText(summaryHtml || contentHtml);
            const pubDate = normalizeText(item.querySelector("pubDate")?.textContent);
            const isoDate = pubDate ? new Date(pubDate).toISOString() : undefined;

            return {
                title: titleText,
                link: linkText,
                guid: guidText,
                summary: summaryHtml || undefined,
                content: contentHtml || undefined,
                contentSnippet: contentSnippet || undefined,
                pubDate: pubDate || undefined,
                isoDate,
            };
        });

        return { title, link, description, lastBuildDate, items };
    }

    const feed = doc.querySelector("feed");
    if (!feed) {
        throw new Error("Unsupported feed format");
    }

    const title = normalizeText(feed.querySelector("title")?.textContent);
    const link =
        normalizeText(feed.querySelector('link[rel="alternate"]')?.getAttribute("href")) ||
        normalizeText(feed.querySelector("link")?.getAttribute("href")) ||
        "";
    const description =
        normalizeText(feed.querySelector("subtitle")?.textContent) ||
        normalizeText(feed.querySelector("tagline")?.textContent);
    const lastBuildDate =
        normalizeText(feed.querySelector("updated")?.textContent) ||
        normalizeText(feed.querySelector("published")?.textContent);
    const items = Array.from(feed.querySelectorAll("entry")).map(entry => {
        const entryTitle = normalizeText(entry.querySelector("title")?.textContent);
        const entryLink = extractLinkFromAtom(entry);
        const entryId =
            normalizeText(entry.querySelector("id")?.textContent) ||
            entryLink ||
            entryTitle;
        const summaryEl = entry.querySelector("summary") || entry.querySelector("content");
        const summaryHtml = getHtmlOrText(summaryEl);
        const contentEl = entry.querySelector("content");
        const contentHtml = getHtmlOrText(contentEl) || summaryHtml;
        const contentSnippet = toPlainText(summaryHtml || contentHtml);
        const pubDate =
            normalizeText(entry.querySelector("updated")?.textContent) ||
            normalizeText(entry.querySelector("published")?.textContent);
        const isoDate = pubDate ? new Date(pubDate).toISOString() : undefined;

        return {
            title: entryTitle,
            link: entryLink,
            guid: entryId,
            summary: summaryHtml || undefined,
            content: contentHtml || undefined,
            contentSnippet: contentSnippet || undefined,
            pubDate: pubDate || undefined,
            isoDate,
        };
    });

    return { title, link, description, lastBuildDate, items };
}

async function fetchFromApi(url: string) {
    const apiUrl = `/api/rss?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const data = (await res.json().catch(() => null)) as RssApiErrorResponse | null;
            throw new Error(formatApiErrorMessage(res.status, res.statusText, data));
        }

        // Fall back to a generic, short message for non-JSON error bodies.
        const code = `${res.status}${res.statusText ? ` ${res.statusText}` : ""}`;
        throw new Error(`RSS API error (${code})`);
    }
    return res.json();
}

async function fetchFromClient(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        const code = `${res.status}${res.statusText ? ` ${res.statusText}` : ""}`;
        throw new Error(`RSS fetch failed (${code})`);
    }
    const xml = await res.text();
    return parseRssXml(xml);
}

export async function rssFetcher(url: string) {
    const config = RSS_CONFIGS.find(item => item.url === url);
    const preferClient = config?.fetchMode === "client";

    if (preferClient && typeof window !== "undefined" && typeof DOMParser !== "undefined") {
        try {
            return await fetchFromClient(url);
        } catch (error) {
            console.warn(`[rss] direct fetch failed for ${url}, falling back to API`, error);
        }
    }

    return fetchFromApi(url);
}
