import ProgressiveImage from "@/components/ui/Image";
import LoadingItem from "@/components/ui/loading/loading";
import { tm } from "@/shared/utils";
import Link from "next/link";
import React from "react";
import { ComponentPropsWithoutRef, ElementRef } from "react";
import { ImNewTab } from "react-icons/im";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
    title: string | undefined;
    name: string | undefined;
    srcs: (string | undefined)[];
    url: string | undefined;
    variant?: "standard" | "medium";
}
export const Card = React.forwardRef<ElementRef<"div">, CardProps>(
    ({ title, url, className, name, variant = "standard", srcs, ...rest }, ref) => {
        const [hover, setHover] = React.useState(false);
        return (
            <Link
                href={url || "#"}
                className="group hover:cursor-pointer"
                target="_blank"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}>
                <div ref={ref} className={tm("relative w-28 shrink-0", className)} {...rest}>
                    {hover && <ImNewTab className="absolute right-0 top-0 z-10 bg-white" />}

                    <ProgressiveImage
                        srcs={srcs}
                        fill={true}
                        sizes="(min-width: 768px) 480px, 360px"
                        alt="image"
                        className=" h-40 w-full"
                        loading={<LoadingItem className="h-40 w-28" />}
                    />
                    <div className="flex flex-col">
                        {title && <span className="font-semibold">{title}</span>}
                        {name && <span className="line-clamp-3 group-hover:text-purple-500">{name}</span>}
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
            <div className={tm("flex flex-col rounded-md", className)} ref={ref} {...rest}>
                <div className="mb-1 flex flex-row gap-2">
                    <div className="mb-2 grow border-b-2 border-black"></div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="mb-2 grow border-b-2 border-black"></div>
                </div>
                {/* <Separator className="mb-2 h-1" /> */}
                {children}
            </div>
        );
    }
);
Section.displayName = "Section";

export const FullLabel = React.forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ children, className, ...rest }, ref) => {
        return (
            <div ref={ref} className={tm("w-full rounded-md text-center font-semibold", className)} {...rest}>
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
            className={tm("whitespace-nowrap rounded-md px-2 font-semibold md:whitespace-normal", className)}
            ref={ref}
            {...rest}>
            {children}
        </span>
    );

    return url ? (
        <Link href={url} target="_blank" className="hover:underline hover:opacity-90">
            {label}
        </Link>
    ) : (
        label
    );
});
Label.displayName = "Label";
