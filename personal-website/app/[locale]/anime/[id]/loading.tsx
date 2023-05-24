import LoadingItem from "@/components/ui/loading/loading";
import { tm } from "@/shared/utils";
import React from "react";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <LoadingItem className="h-6 w-12" />
            </div>
            {/* banner image */}
            <LoadingItem className="h-40 w-full" />

            <div className="flex grid-cols-4 grid-rows-1 flex-col gap-4 md:grid">
                {/* side panel */}
                <div className="flex flex-col gap-4">
                    <div className="hidden h-56 w-full rounded-md bg-gray-500 md:block" />
                    <div className="flex flex-col gap-2">
                        <LoadingItem className="h-6 w-full bg-green-400" />
                        <LoadingItem className="h-6 w-full bg-[rgba(57,119,219,0.8)]" />
                        <LoadingItem className="h-6 w-full bg-[rgba(209,96,104,0.8)]" />
                    </div>
                    <Labels className="bg-[#f48668]" />
                    <Labels className="bg-[#c7b8ea]" />
                    <Labels className="bg-[#c2e1c2]" />
                </div>
                {/* main panel */}
                <div className="col-start-2 col-end-[-1] flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <LoadingItem className="h-8 w-36" />
                        <div className="flex flex-row flex-wrap gap-2">
                            <LoadingItem className="h-6 w-24  bg-slate-200" />
                            <LoadingItem className="h-6 w-24  bg-slate-200" />
                            <LoadingItem className="h-6 w-24  bg-slate-300" />
                        </div>
                    </div>
                    <LoadingItem className=" h-64 w-full" />
                    <Section>
                        <LoadingItem className="h-36 w-full" />
                    </Section>
                    <Section>
                        <Cards />
                    </Section>
                    <Section>
                        <Cards />
                    </Section>
                    <Section>
                        <Cards />
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Labels({ className }: { className?: string }) {
    return (
        <div className="flex flex-row gap-2 overflow-x-auto pb-2 md:flex-wrap">
            {Array.from({ length: 9 }, (_, i) => (
                <LoadingItem className={tm("h-6 w-12", className)} key={i} />
            ))}
        </div>
    );
}

function Section({ children }: { children: React.ReactNode }) {
    return (
        <div className={"flex flex-col"}>
            <div className="mb-1 flex flex-row gap-2">
                <div className="mb-2 grow border-b-2 border-black"></div>
                <LoadingItem className="h-6 w-24" />
                <div className="mb-2 grow border-b-2 border-black"></div>
            </div>

            {children}
        </div>
    );
}

function Card() {
    return (
        <div className="flex flex-col gap-2">
            <LoadingItem className="h-40 w-28" />
            <LoadingItem className="h-6 w-28" />
        </div>
    );
}

function Cards() {
    return (
        <div className="flex flex-row gap-4 overflow-y-scroll">
            {Array.from({ length: 4 }, (_, i) => (
                <Card key={i} />
            ))}
        </div>
    );
}
