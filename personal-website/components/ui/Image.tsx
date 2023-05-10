import React, { PropsWithoutRef, useState } from "react";
import Image, { ImageProps } from "next/image";

export type ProgressiveImageProps = Omit<ImageProps, "src"> & {
    srcs: (string | undefined)[];
};

const ProgressiveImage = (props: ProgressiveImageProps) => {
    let { srcs, alt, ...rest } = props;
    srcs = srcs.filter((src) => !!src); // filter falsy url
    const [imIndex, setImIndex] = useState(0);

    if (srcs.length <= 0) {
        console.warn(`no proper image source given: ${srcs}`);
    }

    return (
        <Image
            src={srcs[imIndex] || "#"}
            onLoadingComplete={() => {
                if (imIndex < srcs.length - 1) {
                    setImIndex(imIndex + 1);
                }
            }}
            alt={alt}
            {...rest}
        />
    );
};

export default ProgressiveImage;
