"use client";
import { tm } from "@/shared/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export type ProgressiveImageProps = Omit<ImageProps, "src" | "loading"> & {
    srcs: (string | undefined)[];
    loading?: JSX.Element;
    fallback?: JSX.Element;
};

const ProgressiveImage = (props: ProgressiveImageProps) => {
    let { srcs: srcs_, alt, loading, fallback, className, ...rest } = props;
    const srcs = srcs_.filter((src) => !!src) as string[]; // filter falsy url

    const [imIndex, setImIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    if (srcs.length <= 0) {
        console.warn(`Progressive Image: No proper image source given: ${srcs}`);
        return fallback || null;
    }

    return (
        <>
            <div className={tm("relative", className)}>
                {!loaded && (loading || null)}

                <Image
                    className={"object-cover object-center"}
                    src={srcs[imIndex]}
                    onLoadingComplete={() => {
                        setLoaded(true);
                        if (imIndex < srcs.length - 1) {
                            setImIndex(imIndex + 1);
                        }
                    }}
                    alt={alt}
                    {...rest}
                />
            </div>
        </>
    );
};

export default ProgressiveImage;
