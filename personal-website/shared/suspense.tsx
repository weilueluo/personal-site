"use client";
export function suspensify<T>(promise: Promise<T>) {
    let status = "pending";
    let result: T;

    // console.log("suspensify init", promise);

    let suspender = promise.then(
        (response) => {
            status = "success";
            result = response;
        },
        (error) => {
            status = "error";
            result = error;
        }
    );

    const read = () => {
        switch (status) {
            case "pending":
                throw suspender;
            case "error":
                throw result;
            default:
                return result;
        }
    };

    return { read };
}
