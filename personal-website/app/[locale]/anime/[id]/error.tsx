"use client";

import ErrorPage from "@/components/common/error";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return <ErrorPage error={error} reset={reset} />;
}
