"use client";
export function suspensify<T>(promise: Promise<T>) {
    let status = "pending";
    let result: T;

    // console.log("suspensify init", promise);

    let suspender = promise.then(
        (response) => {
            status = "success";
            // console.log("suspensify success", promise);
            result = response;
            // return Promise.resolve(response);
        },
        (error) => {
            status = "error";
            // console.log("suspensify error", promise);
            result = error;
            // return Promise.reject(error);
        }
    );

    console.log("suspensify init end", promise, suspender);

    const read = () => {
        switch (status) {
            case "pending":
                // console.log("read pending", suspender);

                throw suspender;
            case "error":
                // console.log("read error", result);
                throw result;
            default:
                return result;
        }
    };

    return { read };
}
