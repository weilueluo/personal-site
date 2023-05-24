"use client"

import React, { ComponentPropsWithoutRef, ElementRef, useState } from "react";
import { Character, Relation, Staff, VoiceActor } from "../graphql/graphql";
import { useAnimeDetails } from "./context";
import { Card, Section, Cards, Label } from "./primitives";
import Link from "next/link";
import ProgressiveImage from "@/components/ui/Image";
import LoadingItem from "@/components/ui/loading/loading";

function RelationCard({ data }: { data: Relation }) {
    const title = data.relationType?.replace("_", " ");
    const name = data.node.title?.english || data.node.title?.romaji || data.node.title?.native;
    const srcs = [data.node.coverImage?.medium, data.node.coverImage?.large];
    const url = data.node.siteUrl;

    return <Card title={title} url={url} name={name} srcs={srcs} className="overflow-hidden rounded-md" />;
}

interface VoiceActorCardProps extends ComponentPropsWithoutRef<"div"> {
    data: VoiceActor;
}
const VoiceActorCard = React.forwardRef<ElementRef<"div">, VoiceActorCardProps>(({ data, ...rest }, ref) => {
    const name = [data?.name?.full, data?.name?.native, ...(data.name?.alternative || [])].filter(
        (title) => !!title
    )[0] as string;
    const srcs = [data?.image?.medium, data.image?.large];
    const url = data?.siteUrl;

    return <Card title={"VA"} name={name} url={url} srcs={srcs} {...rest} ref={ref} className=" text-right" />;
});
VoiceActorCard.displayName = "VoiceActorCard";

function CharacterCard({ data }: { data: Character }) {
    const name = [data.node?.name?.full, data.node?.name?.alternative, ...(data.node?.name?.alternative || [])].filter(
        (title) => !!title
    )[0] as string;
    const srcs = [data.node?.image?.medium, data.node?.image?.large];
    const title = data.role;
    const url = data.node?.siteUrl;

    return (
        <div className="flex shrink-0 flex-row overflow-hidden rounded-md">
            <Card title={title} name={name} url={url} srcs={srcs} className="rounded-none" />
            {data.voiceActors?.map((voiceActor) => (
                <VoiceActorCard key={voiceActor.id} className="rounded-none" data={voiceActor} />
            ))}
        </div>
    );
}

function StaffCard({ data }: { data: Staff }) {
    const name = [data.node?.name?.full, data.node?.name?.alternative, ...(data.node?.name?.alternative || [])].filter(
        (title) => !!title
    )[0] as string;
    const srcs = [data.node?.image?.medium, data.node?.image?.large];
    const title = data.role;
    const url = data.node?.siteUrl;

    return <Card title={title} name={name} url={url} srcs={srcs} className="overflow-hidden rounded-md" />;
}

export function Characters() {
    const data = useAnimeDetails();

    const characters = data?.characters?.edges;

    return characters && characters.length > 0 ? (
        <Section title="Characters">
            <Cards className="gap-6">
                {characters?.map((character) => (
                    <CharacterCard key={character.id} data={character} />
                ))}
            </Cards>
        </Section>
    ) : null;
}

export function Staffs() {
    const data = useAnimeDetails();

    const staffs = data?.staff?.edges;

    return staffs && staffs.length > 0 ? (
        <Section title="Staffs">
            <Cards className="gap-4">
                {staffs?.map((staff) => (
                    <StaffCard key={staff.id} data={staff} />
                ))}
            </Cards>
        </Section>
    ) : null;
}

export function Relations() {
    const data = useAnimeDetails();

    const relations = data?.relations?.edges;

    return relations && relations.length > 0 ? (
        <Section title="Relations">
            <Cards className="gap-4">
                {relations?.map((relation) => (
                    <RelationCard key={relation.id} data={relation} />
                ))}
            </Cards>
        </Section>
    ) : null;
}

export function Trailer() {
    const data = useAnimeDetails();

    const videoSource =
        data?.trailer?.site == "youtube"
            ? `https://www.youtube.com/embed/${data?.trailer?.id}`
            : `https://www.dailymotion.com/embed/video/${data?.trailer?.id}?autoplay=0`;

    return data?.trailer ? (
        <Section title="Trailer" className="h-fit">
            <div className="relative h-0 pb-[56.25%]">
                <iframe
                    className="absolute left-0 top-0 h-full w-full animate-in fade-in-0 slide-in-from-right-4"
                    src={videoSource}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen={true}></iframe>
            </div>
        </Section>
    ) : null;
}

export function Title() {
    const data = useAnimeDetails();

    const titles = [data?.title?.english, data?.title?.native, data?.title?.romaji].filter((title) => !!title);
    const mainTitle = titles[0];
    const subTitles = [...new Set(titles.slice(1).filter((title) => title !== mainTitle))];

    const url = data?.siteUrl;

    const [showOtherNames, setShowOtherNames] = useState(false);
    const synonyms = data?.synonyms || [];

    return (
        <div className="flex flex-col flex-wrap gap-2">
            <Link href={url || "#"} target="_blank">
                <h1 className="text-2xl font-bold hover:cursor-pointer hover:underline">{mainTitle}</h1>
            </Link>
            <div className="flex flex-row flex-wrap gap-2 text-sm">
                {subTitles.map((title) => (
                    <Label url={url} key={title} className=" bg-slate-200 hover:cursor-pointer hover:underline">
                        {title}
                    </Label>
                ))}
                {showOtherNames &&
                    synonyms.map((title) => (
                        <Label url={url} key={title} className=" bg-slate-200 hover:cursor-pointer hover:underline">
                            {title}
                        </Label>
                    ))}
                {synonyms && synonyms.length > 0 && (
                    <Label
                        key={"otherName"}
                        className=" bg-slate-200 hover:cursor-pointer hover:underline"
                        onClick={() => setShowOtherNames(!showOtherNames)}>
                        {showOtherNames ? "hide" : "show more..."}
                    </Label>
                )}
            </div>
        </div>
    );
}

export function Description() {
    const data = useAnimeDetails();

    return data?.description ? (
        <p dangerouslySetInnerHTML={{ __html: data.description }} className=" font-semibold" />
    ) : null;
}

export function CoverImage() {
    const data = useAnimeDetails();

    return data?.coverImage ? (
        <div className="w-full">
            <ProgressiveImage
                srcs={[data?.coverImage?.medium, data?.coverImage?.large]}
                fill={true}
                sizes="(min-width: 1024px) 480px, 320px"
                alt="image"
                className="hidden h-56 overflow-hidden rounded-md md:block"
                loading={<LoadingItem className="h-56 w-full" />}
            />
        </div>
    ) : null;
}
