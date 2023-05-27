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
import Link from "next/link";
import React from "react";
import { MdEmail } from "react-icons/md";
import styles from "./page.module.scss";

export default function Page() {
    return (
        <div className="flex w-full flex-col items-center gap-4">
            <Section>
                <Title>Frameworks</Title>
                <div className="grid grid-cols-3">
                    <Item className="group" href="https://react.dev/">
                        <SiReact size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://threejs.org/">
                        <SiThreedotjs size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://nextjs.org/">
                        <SiNextdotjs size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://tailwindcss.com/">
                        <SiTailwindcss size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://www.typescriptlang.org/">
                        <SiTypescript size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://sass-lang.com/">
                        <SiSass size="2rem" className="group-hover:animate-spin" />
                    </Item>
                </div>
            </Section>
            <Section>
                <Title>Infrastructure</Title>
                <div className="grid grid-cols-3">
                    <Item className="group" href="https://aws.amazon.com/">
                        <SiAmazonaws size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://vercel.com/">
                        <SiVercel size="2rem" className="group-hover:animate-spin" />
                    </Item>
                    <Item className="group" href="https://github.com/weilueluo/personal-website/tree/v2">
                        <SiGithub size="2rem" className="group-hover:animate-spin" />
                    </Item>
                </div>
            </Section>
            <Section>
                <Title>Contact</Title>
                <div className="flex flex-row gap-2">
                    <Item className="w-fit p-4" href="mailto:luoweilue@gmail.com">
                        <MdEmail size="2rem" />
                        <span>luoweilue@gmail.com</span>
                    </Item>
                </div>
            </Section>
            <Section>
                <Title>Send Me a Message</Title>
                <SendMessage />
            </Section>
        </div>
    );
}

function Title({ children }: { children: React.ReactNode }) {
    return <h2 className=" text-lg font-semibold">{children}</h2>;
}

function Item({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
    return (
        <Link href={href} target="_blank">
            <div className={tm("std-hover relative h-24 w-24", className)}>
                <div className={tm("h-full w-full", styles.borderT)}>
                    <div className={tm("grid h-full w-full place-items-center", styles.borderB)}>{children}</div>
                </div>
            </div>
        </Link>
    );
}

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={tm("flex flex-col items-center gap-1", className)}>{children}</div>;
};

function SendMessage() {
    return (
        <div>
            {/* <form>
                <input type="text" />
                <button>Send</button>
            </form> */}
            TODO
        </div>
    );
}
