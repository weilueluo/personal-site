"use client";
import { m } from "@/shared/css";
import { LOCALES } from "@/shared/i18n/settings";
import MultiButton from "@/shared/ui/button/MultiButton";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./LocaleButton.module.scss";

export default function LangButton() {
    const [current, setCurrent] = useState<"EN" | "CN" | "JP">("EN");

    const params = useSearchParams().toString();
    const path = usePathname();
    const router = useRouter();

    // const onToggle = name =>

    const buttons = LOCALES.map(locale => <LocaleLink name={locale} current={current} onClick={() => router.push(`/${locale}${path}?${params}`)}/>);


    return (
        <div>
            {buttons}        
        </div>
    )
}

const LocaleLink = (props: { name: string; current: string, onClick: () => unknown } & JSX.IntrinsicElements["button"]) => {
    const { name, current, onClick, ...others } = props;

    return (
        <button onClick={onClick}>
            {name}
        </button>
    );
};
