"use client";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/constants";
import { replaceLocale } from "@/shared/locale";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import MultiButton from "../ui/MultiButton";

export interface LocaleButtonProps extends React.ComponentPropsWithoutRef<"div"> {}

const LocaleButton = React.forwardRef<React.ElementRef<"div">, LocaleButtonProps>(
    ({ className, ...otherProps }, ref) => {
        const currentLocale = useParams().locale || DEFAULT_LOCALE;
        const pathname = usePathname();

        // console.log(pathname + " " + currentLocale);
        // for (const locale of LOCALES) {
        //     console.log(locale, replaceLocale(pathname, currentLocale, locale, DEFAULT_LOCALE));
        // }

        const buttons = (LOCALES ?? []).map((locale) => (
            <Link
                key={locale}
                href={replaceLocale(pathname, currentLocale, locale)}
                data-active={locale === currentLocale}
                className="flex flex-row items-center justify-center uppercase">
                <span>{locale}</span>
            </Link>
        ));

        return (
            <MultiButton ref={ref} className={className} {...otherProps}>
                {buttons}
            </MultiButton>
        );
    }
);

LocaleButton.displayName = "LocaleButton";

// interface LocalLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
//     locale: string;
//     current: string | undefined;
// }

// const LocaleLink = ({ locale, current, ...props }: LocalLinkProps) => {
//     const active = locale === current;

//     return (

//     );
// };

export default LocaleButton;
