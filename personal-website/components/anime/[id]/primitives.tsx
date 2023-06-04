import ProgressiveImage from "@/components/ui/image";
import LoadingItem from "@/components/ui/loading/loading";
import { formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import Link from "next/link";
import React, { ComponentPropsWithoutRef, ElementRef } from "react";
import { ImNewTab } from "react-icons/im";

interface CardProps extends BaseCompProps<"div"> {
    title: string | undefined;
    name: string | undefined;
    srcs: (string | undefined)[];
    url: string | undefined;
}
export const Card = React.forwardRef<ElementRef<"div">, CardProps>(
    ({ title, url, className, name, messages, srcs, ...rest }, ref) => {
        const [hover, setHover] = React.useState(false);
        return (
            <Link
                href={url || "#"}
                className="group hover:cursor-pointer hover:underline"
                target="_blank"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}>
                <div ref={ref} className={tm("relative w-20 shrink-0 md:w-28", className)} {...rest}>
                    {hover && <ImNewTab className="pointer-events-none absolute right-0 top-0 z-10 bg-white" />}

                    <ProgressiveImage
                        srcs={srcs}
                        fill={true}
                        sizes="(min-width: 768px) 480px, 360px"
                        alt={formattedMessage(messages, "anime.details.card.image_alt")}
                        className="h-32 w-full md:h-40"
                        loading={<LoadingItem className="h-32 w-20 md:h-40 md:w-28" />}
                    />
                    <div className="flex flex-col">
                        {title && <span className="line-clamp-2 font-semibold">{title}</span>}
                        {name && <span className="line-clamp-3">{name}</span>}
                    </div>
                </div>
            </Link>
        );
    }
);
Card.displayName = "Card";

export const Cards = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ children, className, ...rest }, ref) => {
        return (
            <div className={tm("flex flex-row gap-2 overflow-x-auto overflow-y-hidden", className)} ref={ref} {...rest}>
                {children}
            </div>
        );
    }
);
Cards.displayName = "Cards";

export const Section = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ title, children, className, ...rest }, ref) => {
        return (
            <div className={tm("flex flex-col", className)} ref={ref} {...rest}>
                <div className="mb-1 flex flex-row gap-2">
                    <div className="mb-2 grow border-b border-black"></div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <div className="mb-2 grow border-b border-black"></div>
                </div>
                {children}
            </div>
        );
    }
);
Section.displayName = "Section";

export const FullLabel = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ children, className, ...rest }, ref) => {
        return (
            <div ref={ref} className={tm("w-full text-center font-semibold", className)} {...rest}>
                {children}
            </div>
        );
    }
);
FullLabel.displayName = "FullLabel";

export function Labels({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row items-start gap-2 overflow-x-auto pb-2 md:flex-wrap">{children}</div>;
}

export interface LabelProps extends ComponentPropsWithoutRef<"span"> {
    url?: string | undefined;
}
export const Label = React.forwardRef<ElementRef<"span">, LabelProps>(({ children, className, url, ...rest }, ref) => {
    const label = (
        <span
            className={tm("std-hover whitespace-nowrap px-2 font-semibold md:whitespace-normal", className)}
            ref={ref}
            {...rest}>
            {children}
        </span>
    );

    return url ? (
        <Link href={url} target="_blank">
            {label}
        </Link>
    ) : (
        label
    );
});
Label.displayName = "Label";
