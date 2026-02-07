import { NextRequest } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/shared/supabase/server";

const commentQuerySchema = z.object({
    filename: z.string().trim().min(1),
});

const commentBodySchema = z.object({
    filename: z.string().trim().min(1),
    content: z.string().trim().min(1),
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const parsed = commentQuerySchema.safeParse({ filename: searchParams.get("filename") });
    if (!parsed.success) {
        return Response.json({ error: "Invalid filename" }, { status: 400 });
    }

    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("comments")
            .select("content, created_at")
            .eq("filename", parsed.data.filename)
            .order("created_at", { ascending: true });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        const comments = (data || []).map(item => ({
            content: item.content,
            time: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        }));

        return Response.json({ comments });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load comments";
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const parsed = commentBodySchema.safeParse(payload);
        if (!parsed.success) {
            return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
        }

        const supabase = createServerClient();
        const { error } = await supabase.from("comments").insert({
            filename: parsed.data.filename,
            content: parsed.data.content,
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send comment";
        return Response.json({ error: message }, { status: 500 });
    }
}
