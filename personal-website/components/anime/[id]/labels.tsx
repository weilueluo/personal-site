import { timeSinceSeconds, tm } from "@/shared/utils";
import React, { ElementRef, ComponentPropsWithoutRef } from "react";
import { useAnimeDetails } from "./context";
import { FullLabel, Labels, Label } from "./primitives";

export function Status() {
    const data = useAnimeDetails();

    const status = data?.status || "UNKNOWN";

    return <FullLabel className=" bg-green-400">{status}</FullLabel>;
}

export function NextAiring() {
    const data = useAnimeDetails();

    const timeUntilNextAiring =
        data?.nextAiringEpisode && timeSinceSeconds(data.nextAiringEpisode?.timeUntilAiring || 0);

    const nextEpisode = data?.nextAiringEpisode?.episode || 1;
    const totalEpisode = data?.episodes || 1;

    const breakpoint = (Math.max(nextEpisode - 1, 0) / totalEpisode) * 100;

    return (
        <FullLabel
            style={{
                background: `linear-gradient(90deg, rgba(57,119,219,0.8) 0% ${breakpoint}%, rgba(57,119,219,0.5) ${
                    breakpoint + 1
                }% 100%)`,
            }}>
            {data?.nextAiringEpisode
                ? `Ep. ${nextEpisode}/${totalEpisode} in ${timeUntilNextAiring}`
                : "Episode Unavailable"}
        </FullLabel>
    );
}

export function Score() {
    const data = useAnimeDetails();

    const breakpoint = Math.max(data?.meanScore || 0, 0);

    return (
        <FullLabel
            style={{
                color: "black",
                background: `linear-gradient(90deg, rgba(209,96,104,0.8) 0% ${breakpoint}%, rgba(209,96,104,0.5) ${
                    breakpoint + 1
                }% 100%)`,
            }}>
            {data?.meanScore ? `Rating ${data.meanScore}` : "Score Unavailable"}
        </FullLabel>
    );
}

export function Genres() {
    const data = useAnimeDetails();

    return data?.genres ? (
        <Labels>
            {data.genres.map((genre) => (
                <Label key={genre} className=" bg-[#f48668]" url={`https://anilist.co/search/anime/${genre}`}>
                    {genre}
                </Label>
            )) || null}
        </Labels>
    ) : null;
}

export function Tags() {
    const data = useAnimeDetails();

    return data?.tags ? (
        <Labels>
            {data.tags.map((tag) => (
                // tag is search with genre query... not an mistake
                <Label
                    key={tag.name}
                    className="bg-[#c7b8ea]"
                    url={`https://anilist.co/search/anime?genres=${tag.name}`}>
                    {tag.name}
                </Label>
            )) || null}
        </Labels>
    ) : null;
}

export function HashTags() {
    const data = useAnimeDetails();

    return data?.hashtag ? (
        <Labels>
            {data.hashtag.split(" ").map((tag) => (
                <Label key={tag} className=" bg-[#c2e1c2]" url={`https://twitter.com/hashtag/${tag.replace("#", "")}`}>
                    {tag}
                </Label>
            ))}
        </Labels>
    ) : null;
}
