import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { useAnimeDetails } from "./context";
import { FullLabel, Label, Labels } from "./primitives";

export function Status({ messages }: BaseCompProps<"div">) {
    const data = useAnimeDetails();

    const status = data?.status || formattedMessage(messages, "anime.details.status.unknown");

    return <FullLabel className=" bg-green-400">{status}</FullLabel>;
}

export function NextAiring({ messages, locale }: BaseCompProps<"div">) {
    const data = useAnimeDetails();

    const nextAiringDate = new Date(((data?.nextAiringEpisode && data.nextAiringEpisode?.airingAt) || 0) * 1000);

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
                ? formattedMessage(messages, "anime.details.next_airing", locale, {
                      nextEpisode: nextEpisode,
                      totalEpisode: totalEpisode,
                      timeUntilNextAiring: nextAiringDate,
                  })
                : formattedMessage(messages, "anime.details.next_airing.unavailable")}
        </FullLabel>
    );
}

export function Score({ messages, locale }: BaseCompProps<"div">) {
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
            {data?.meanScore ? (
                <FormattedMessage
                    messages={messages}
                    id="anime.details.score"
                    locale={locale}
                    values={{
                        score: data?.meanScore,
                    }}
                />
            ) : (
                <FormattedMessage messages={messages} id="anime.details.score.unavailable" />
            )}
        </FullLabel>
    );
}

export function Genres() {
    const data = useAnimeDetails();

    return data?.genres ? (
        <Labels>
            {data.genres.map(genre => (
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
            {data.tags.map(tag => (
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
            {data.hashtag.split(" ").map(tag => (
                <Label key={tag} className=" bg-[#c2e1c2]" url={`https://twitter.com/hashtag/${tag.replace("#", "")}`}>
                    {tag}
                </Label>
            ))}
        </Labels>
    ) : null;
}
