import React, { ComponentPropsWithoutRef, ElementRef } from "react";
import { Character, Relation, Staff, VoiceActor } from "../graphql";
import { useAnimeDetails } from "./context";
import { Card, Section, Cards } from "./primitives";

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
                    className="absolute left-0 top-0 h-full w-full animate-in slide-in-from-right-4 fade-in-0"
                    src={videoSource}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen={true}></iframe>
            </div>
        </Section>
    ) : null;
}
