"use client";
import { useSetLocale } from "@/shared/i18n";
import { LOCALES } from "@/shared/i18n/settings";
import MultiButton from "@/shared/ui/button/MultiButton";
import styles from "./LocaleButton.module.scss";

export default function LocaleButton({ locale }: {locale: string}) {
    const currentLocale = locale;
    const setLocale = useSetLocale();

    const buttons = LOCALES.map((locale) => (
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
