"use client";
import { SectionMedia } from "@/components/anime/graphql/graphql";
import ProgressiveImage from "@/components/ui/image";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { Trigger } from "../ui/dropdown";
import IconedText from "../ui/icon-text";
import { SearchResult } from "./searcher";

export type SearchResultProps = BaseCompProps<"div"> & SearchResult;

export default function SearchResultPage({
    messages,
    locale,
    rawResponse,
    animeData,
    pageInfo,
    ...rest
}: SearchResultProps) {
    useEffect(() => rawResponse.error && console.error(rawResponse.error), [rawResponse.error]);

    // button text by state
    const [buttonText, setButtonText] = useState(formattedMessage(messages, "anime.search.result.loading"));
    useEffect(() => {
        if (rawResponse.isLoading || rawResponse.isValidating) {
            setButtonText(formattedMessage(messages, "anime.search.result.loading"));
        } else if (!pageInfo?.hasNextPage) {
            setButtonText(formattedMessage(messages, "anime.search.result.all_loaded"));
        } else {
            setButtonText(formattedMessage(messages, "anime.search.result.load_more"));
        }
    }, [pageInfo?.hasNextPage, messages, rawResponse.isLoading, rawResponse.isValidating]);

    // load more when reach bottom
    useEffect(() => {
        const handleScroll = () => {
            if (rawResponse.isLoading || rawResponse.isValidating) {
                return;
            }

            // https://stackoverflow.com/questions/9439725/how-to-detect-if-browser-window-is-scrolled-to-bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                rawResponse.setSize(rawResponse.size + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [rawResponse]);

    const [collapse, setCollapse] = useState(false);

    const pathname = usePathname();

    return (
        <>
            {/* loading header */}
            <div className="my-2 flex flex-row justify-between" {...rest}>
                <h3 className="text-xl font-bold capitalize">
                    <FormattedMessage id="anime.search.result.results" messages={messages} />
                    {(rawResponse.isLoading || rawResponse.isValidating) && (
                        <VscLoading className="mx-2 inline-block animate-spin align-middle" />
                    )}
                </h3>

                <IconedText onClick={() => setCollapse(v => !v)}>
                    <Trigger open={!collapse}>
                        {collapse ? (
                            <FormattedMessage id="anime.search.result.expand" messages={messages} />
                        ) : (
                            <FormattedMessage id="anime.search.result.collapse" messages={messages} />
                        )}
                    </Trigger>
                </IconedText>
            </div>

            {/* content */}
            <div className="relative">
                {/* image cards */}
                <ul
                    className={tm(
                        collapse && "flex w-full flex-row gap-2 overflow-x-auto",
                        !collapse && "my-grid-cols-3 md:my-grid-cols-4 lg:my-grid-cols-5 grid justify-between"
                    )}>
                    {animeData.map(data => (
                        <Link href={`${pathname}/${data.id}`} key={data.id} prefetch={false}>
                            <Card data={data} messages={messages} locale={locale} />
                        </Link>
                    ))}
                    {(rawResponse.isLoading || rawResponse.isValidating) &&
                        (!animeData || animeData.length == 0) &&
                        Array.from(Array(15).keys()).map(i => <PlaceholderCard key={i} />)}
                </ul>

                {/* load more info / button */}
                <div className="flex w-full justify-center">
                    <button
                        className="std-pad std-hover mt-2"
                        onClick={() => rawResponse.setSize(rawResponse.size + 1)}
                        disabled={!pageInfo?.hasNextPage}>
                        {buttonText}
                        {pageInfo && ` (${animeData.length}/${pageInfo.total})`}
                        {(rawResponse.isLoading || rawResponse.isValidating) && (
                            <VscLoading className="mx-2 inline-block animate-spin align-middle" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

interface CardProps extends BaseCompProps<"div"> {
    data: SectionMedia;
}
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { data, className, messages } = props;
    return (
        <div ref={ref} className={tm("group hover:underline", className)}>
            <div className="max-w-36 w-24 duration-150 sm:w-36">
                <ProgressiveImage
                    srcs={[data.coverImage?.medium, data.coverImage?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 320px"
                    alt={formattedMessage(messages, "anime.search.result.image_alt")}
                    className="relative h-36 w-full overflow-hidden sm:h-52"
                    loading={<div className="h-36 w-24 bg-gray-500 sm:h-52 sm:w-36" />}
                />
                <span className="sm-text-size line-clamp-4 break-words font-semibold">
                    {data.title?.english || data.title?.romaji || data.title?.native}
                </span>
            </div>
        </div>
    );
});
Card.displayName = "Card";

function PlaceholderCard() {
    return (
        <div>
            <div className="max-w-36 w-24 duration-150 animate-in slide-in-from-top-6 sm:w-36">
                <div className="h-36 bg-gray-400 sm:h-52" />
                <span className="inline-block h-4 w-full bg-gray-400"></span>
            </div>
        </div>
    );
}
