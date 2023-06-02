"use client";

import ErrorPage from "@/components/common/error";

export default function Error({ error, reset }: any) {
    return <ErrorPage error={error} reset={reset} />;
}
