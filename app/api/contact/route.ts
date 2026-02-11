import { NextRequest } from "next/server";
import { ServerClient } from "postmark";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().max(200).optional().or(z.literal("")),
    contact: z.string().trim().max(200).optional().or(z.literal("")),
    message: z.string().trim().min(1, "Message is empty").max(5000),
});

const buildMessageBody = (data: z.infer<typeof contactSchema>, isDev: boolean) => {
    const header = isDev ? "[DEV]\n\n" : "";
    return (
        `${header}` +
        `Name:\n${data.name || ""}\n\n` +
        `Message:\n${data.message}\n\n` +
        `Contact:\n${data.contact || ""}`
    );
};

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const parsed = contactSchema.safeParse(payload);
        if (!parsed.success) {
            return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
        }

        const serverToken = process.env.POSTMARK_SERVER_TOKEN;
        const from = process.env.POSTMARK_FROM;
        const to = process.env.POSTMARK_TO;

        if (!serverToken || !from || !to) {
            return Response.json({ error: "Email service is not configured" }, { status: 500 });
        }

        const client = new ServerClient(serverToken);
        const messageStream = process.env.POSTMARK_MESSAGE_STREAM;
        const response = await client.sendEmail({
            From: from,
            To: to,
            Subject: "Message via Personal Website",
            TextBody: buildMessageBody(parsed.data, process.env.NODE_ENV === "development"),
            ...(messageStream ? { MessageStream: messageStream } : {}),
        });

        return Response.json({ id: response.MessageID }, {
            headers: { "Cache-Control": "no-store, max-age=0" },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send message";
        return Response.json({ error: message }, { status: 500 });
    }
}
