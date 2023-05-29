import {
    SiAmazonaws,
    SiGithub,
    SiNextdotjs,
    SiReact,
    SiSass,
    SiTailwindcss,
    SiThreedotjs,
    SiTypescript,
    SiVercel,
} from "react-icons/si";

import { tm } from "@/shared/utils";
import React from "react";
import { MdEmail } from "react-icons/md";
import { Item } from "./item";
import SendMessage from "./send-message";

export default function Page() {
    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex w-max flex-col gap-4">
                <Section>
                    <Title>Frameworks</Title>
                    <div className="grid grid-cols-3">
                        <Item name="React" className="group" href="https://react.dev/">
                            <SiReact size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="ThreeJs" className="group" href="https://threejs.org/">
                            <SiThreedotjs size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="NextJs" className="group" href="https://nextjs.org/">
                            <SiNextdotjs size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="Tailwindcss" className="group" href="https://tailwindcss.com/">
                            <SiTailwindcss size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="Typescript" className="group" href="https://www.typescriptlang.org/">
                            <SiTypescript size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="Sass" className="group" href="https://sass-lang.com/">
                            <SiSass size="2rem" className="group-hover:animate-spin" />
                        </Item>
                    </div>
                </Section>
                <Section>
                    <Title>Infrastructure</Title>
                    <div className="grid grid-cols-3">
                        <Item name="AWS" className="group" href="https://aws.amazon.com/">
                            <SiAmazonaws size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item name="Vercel" className="group" href="https://vercel.com/">
                            <SiVercel size="2rem" className="group-hover:animate-spin" />
                        </Item>
                        <Item
                            name="Github"
                            className="group"
                            href="https://github.com/weilueluo/personal-website/tree/v2">
                            <SiGithub size="2rem" className="group-hover:animate-spin" />
                        </Item>
                    </div>
                </Section>
                <Section>
                    <Title>Message</Title>
                    <SendMessage />
                </Section>
                <Section>
                    <Title>Email</Title>
                    <div className="group flex w-full flex-row gap-2">
                        <Item className="w-full p-4" href="mailto:luoweilue@gmail.com">
                            <MdEmail size="2rem" className="group-hover:animate-spin" />
                            <span className="font-semibold">luoweilue@gmail.com</span>
                        </Item>
                    </div>
                </Section>
            </div>
        </div>
    );
}

function Title({ children }: { children: React.ReactNode }) {
    return <h2 className=" text-lg font-semibold">{children}</h2>;
}

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={tm("flex flex-col items-center gap-1", className)}>{children}</div>;
};
