"use client";
import React from "react";
import MultiButton from "../ui/MultiButton";
import { useRouter } from "next/router";
import Link from "next/link";

export interface LocaleButtonProps extends React.ComponentPropsWithoutRef<"div"> {}

const LocaleButton = React.forwardRef<React.ElementRef<"div">, LocaleButtonProps>(
    ({ className, ...otherProps }, ref) => {
        const { locale: currentLocale, locales, pathname } = useRouter();

        const buttons = (locales ?? []).map((locale) => (
            <Link
                key={locale}
                href={pathname}
                locale={locale}
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
