import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    const apiKey = secretKey ?? publishableKey;

    if (!url || !apiKey) {
        throw new Error(
            "Supabase environment variables are not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_PUBLISHABLE_KEY."
        );
    }

    return createClient(url, apiKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
