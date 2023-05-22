"use client";

import { AnimeDetailsProvider, useAnimeDetails } from "@/components/anime/details";
import { Character as CharacterType, Relation as RelationType, Staff as StaffType } from "@/components/anime/graphql";
import ProgressiveImage from "@/components/ui/Image";
import Separator from "@/components/ui/Separator";
import { timeSinceSeconds } from "@/shared/utils";

export default async function Page({ params }: { params: { id: number } }) {
    return (
        // @ts-ignore async server component
        <AnimeDetailsProvider animeId={params.id}>
            <Content />
        </AnimeDetailsProvider>
    );
}

function Content() {
    const data = useAnimeDetails();

    console.log("anime details", data);

    return (
        <div>
            <div className=" relative h-40 w-full">
                <ProgressiveImage
                    srcs={[data?.bannerImage]}
                    fill={true}
                    sizes="(min-width: 1024px) 1024px, 768px"
                    alt="image"
                    className="rounded-md object-cover object-center"
                    fallback={<div className="h-54 w-full rounded-md bg-gray-500" />}
                />
            </div>

            <div className="grid grid-cols-4 grid-rows-1 gap-4">
                <div>
                    <CoverImage />
                    <Status />
                    <NextAiring />
                    <Score />
                    <Genres />
                    <Tags />
                    <HashTags />
                </div>
                <div className="col-start-2 col-end-[-1] border">
                    <Title />
                    <Description />
                    <Trailer />
                    <Relations />
                    <Characters />
                    <Staffs />
                </div>
            </div>

            {/* <h1>{titles[0]}</h1>
            <div>
                {titles.slice(1).map((title) => (
                    <span className="bg-gray-500 px-2 py-1 text-gray-300" key={title}>
                        {title}
                    </span>
                ))}
            </div>

            <div>
                <p>{data?.description}</p>
            </div> */}
        </div>
    );
}

function Relation({ data }: { data: RelationType }) {
    const title = [data.node.title?.english, data.node.title?.romaji, data.node.title?.native].filter(
        (title) => !!title
    )[0];

    return (
        <div className="w-24 shrink-0">
            <div className="relative h-36">
                <ProgressiveImage
                    srcs={[data.node.coverImage?.medium, data.node.coverImage?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 360px"
                    alt="image"
                    className="rounded-md object-cover object-center"
                    fallback={<div className="h-54 w-full rounded-md bg-gray-500" />}
                />
            </div>
            <span>{title}</span>
        </div>
    );
}

function Character({ data }: { data: CharacterType }) {
    const title = [data.node?.name?.full, data.node?.name?.alternative, ...(data.node?.name?.alternative || [])].filter(
        (title) => !!title
    )[0];

    return (
        <div className="w-24 shrink-0">
            <div className="relative h-36">
                <ProgressiveImage
                    srcs={[data.node?.image?.medium, data.node?.image?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 360px"
                    alt="image"
                    className="rounded-md object-cover object-center"
                    fallback={<div className="h-54 w-full rounded-md bg-gray-500" />}
                />
            </div>
            <span>{title}</span>
        </div>
    );
}

function Staff({ data }: { data: StaffType }) {
    const title = [data.node?.name?.full, data.node?.name?.alternative, ...(data.node?.name?.alternative || [])].filter(
        (title) => !!title
    )[0];

    return (
        <div className="w-24 shrink-0">
            <div className="relative h-36">
                <ProgressiveImage
                    srcs={[data.node?.image?.medium, data.node?.image?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 360px"
                    alt="image"
                    className="rounded-md object-cover object-center"
                    fallback={<div className="h-54 w-full rounded-md bg-gray-500" />}
                />
            </div>
            <span>{title}</span>
        </div>
    );
}

function Characters() {
    const data = useAnimeDetails();

    const characters = data?.characters?.edges;

    return (
        <div className="flex flex-col">
            <h3>Characters</h3>
            <Separator />
            <div className="flex flex-row overflow-y-scroll">
                {characters?.map((character) => (
                    <Character key={character.id} data={character} />
                ))}
            </div>
        </div>
    );
}

function Staffs() {
    const data = useAnimeDetails();

    const staffs = data?.staff?.edges;

    return (
        <div className="flex flex-col overflow-y-scroll">
            <h3>Staffs</h3>
            <Separator />
            <div className="flex flex-row overflow-y-scroll">
                {staffs?.map((staff) => (
                    <Staff key={staff.id} data={staff} />
                ))}
            </div>
        </div>
    );
}

function Relations() {
    const data = useAnimeDetails();

    const relations = data?.relations?.edges;

    return (
        <div className="flex flex-col overflow-y-scroll">
            <h3>Relations</h3>
            <Separator />
            <div className="flex flex-row overflow-y-scroll">
                {relations?.map((relation) => (
                    <Relation key={relation.id} data={relation} />
                ))}
            </div>
        </div>
    );
}

function Trailer() {
    const data = useAnimeDetails();

    const videoSource =
        data?.trailer?.site == "youtube"
            ? `https://www.youtube.com/embed/${data?.trailer?.id}`
            : `https://www.dailymotion.com/embed/video/${data?.trailer?.id}?autoplay=0`;

    return (
        <div>
            <h3>Trailer</h3>
            <Separator />
            <div>
                <iframe
                    src={videoSource}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}></iframe>
            </div>
        </div>
    );
}

function Description() {
    const data = useAnimeDetails();

    return <p>{data?.description || "- no description available -"}</p>;
}

function Title() {
    const data = useAnimeDetails();

    const titles = [data?.title?.english, data?.title?.native, data?.title?.romaji].filter((title) => !!title);

    return (
        <div>
            <h1>{titles[0]}</h1>
            <div>
                {titles.slice(1).map((title) => (
                    <span className="bg-gray-500 px-2 py-1 text-gray-300" key={title}>
                        {title}
                    </span>
                ))}
            </div>
        </div>
    );
}

function CoverImage() {
    const data = useAnimeDetails();

    return (
        <div className="w-full">
            <div className="relative h-56 border bg-gray-600">
                <ProgressiveImage
                    srcs={[data?.coverImage?.medium, data?.coverImage?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 320px"
                    alt="image"
                    className="rounded-md object-cover object-center"
                    fallback={<div className="h-56 w-full bg-gray-500" />}
                />
            </div>
        </div>
    );
}

function Status() {
    const data = useAnimeDetails();

    const status = data?.status || "UNKNOWN";

    return <div>{status}</div>;
}

function NextAiring() {
    const data = useAnimeDetails();

    const timeUntilNextAiring =
        data?.nextAiringEpisode && timeSinceSeconds(data.nextAiringEpisode?.timeUntilAiring || 0);

    const nextEpisode = data?.nextAiringEpisode?.episode || 1;
    const totalEpisode = data?.episodes || 1;

    const breakpoint = (Math.max(nextEpisode - 1, 0) / totalEpisode) * 100;

    return (
        <div
            style={{
                background: `linear-gradient(90deg, rgba(57,119,219,0.8) 0% ${breakpoint}%, rgba(57,119,219,0.5) ${
                    breakpoint + 1
                }% 100%)`,
            }}>
            {data?.nextAiringEpisode
                ? `Ep. ${nextEpisode}/${totalEpisode} in ${timeUntilNextAiring}`
                : "Episode Unavailable"}
        </div>
    );
}

function Score() {
    const data = useAnimeDetails();

    const breakpoint = Math.max(data?.meanScore || 0, 0);

    return (
        <span
            style={{
                color: "black",
                background: `linear-gradient(90deg, rgba(209,96,104,0.8) 0% ${breakpoint}%, rgba(209,96,104,0.5) ${
                    breakpoint + 1
                }% 100%)`,
            }}>
            {data?.meanScore ? `Rating ${data.meanScore}` : "Score Unavailable"}
        </span>
    );
}

function Genres() {
    const data = useAnimeDetails();

    return (
        <div>
            {(data?.genres && data.genres.map((genre) => <span key={genre}>{genre}</span>)) || (
                <span>{"-No Genre Available-"}</span>
            )}
        </div>
    );
}

function Tags() {
    const data = useAnimeDetails();

    return (
        <div>
            {(data?.tags && data.tags.map((tag) => <span key={tag.name}>{tag.name}</span>)) || (
                <span>{"-No Tag Available-"}</span>
            )}
        </div>
    );
}

function HashTags() {
    const data = useAnimeDetails();

    return (
        <div>
            {(data?.hashtag && data.hashtag.split(" ").map((tag) => <span key={tag}>{tag}</span>)) || (
                <span>{"-No Hashtag Available-"}</span>
            )}
        </div>
    );
}
