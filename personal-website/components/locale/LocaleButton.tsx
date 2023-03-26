"use client";
import { m } from "@/shared/css";
import { useLocale, useSetLocale } from "@/shared/i18n";
import { LOCALES } from "@/shared/i18n/settings";
import MultiButton from "@/shared/ui/button/MultiButton";
import Image from "next/image";
import styles from "./LocaleButton.module.scss";
import { FiFlag } from "react-icons/fi";

// import zhFlag from '/public/assets/icons/zh.svg';
// import enFlag from '/public/assets/icons/en.svg';
// import jpFlag from '/public/assets/icons/jp.svg';

export default function LocaleButton() {
    const currentLocale = useLocale();
    const setLocale = useSetLocale();

    const buttons = LOCALES
    // .sort((a, b) => {
    //     if (a === currentLocale) return 1;
    //     if (b === currentLocale) return -1;
    //     return 0;
    // })
    .map((locale) => (
        <LocaleLink
            key={locale}
            name={locale}
            current={currentLocale}
            onClick={() => setLocale(locale)}
        />
    ));

    return <MultiButton>{buttons}</MultiButton>;
}

const LocaleLink = (
    props: {
        name: string;
        current: string | undefined;
        onClick: () => unknown;
    } & JSX.IntrinsicElements["button"]
) => {
    const { name, current, ...others } = props;

    const active = name === current;

    return (
        <button data-active={active} className={styles.button} {...others}>
            {/* {active ? (
                <Image
                    src={`/assets/icons/${name}.svg`}
                    height="128"
                    width="128"
                    alt={`${name} Flag`}
                    className={styles.image}
                />
            ) : (
                name
            )} */}
            <span>{name}</span>
            {/* {active && <FiFlag />} */}
        </button>
    );
};
