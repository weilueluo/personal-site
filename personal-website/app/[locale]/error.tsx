"use client"

import ErrorPage from "@/components/error/error";

export default function Error({ error, reset }: any) {
    return (
        <ErrorPage error={error} reset={reset} />
    );
}
