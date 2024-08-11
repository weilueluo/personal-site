"use client";

import IconedText from "@/components/ui/icon-text";
import { useResolvedHref } from "@/shared/i18n/locale.client";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { getDomainedOrigin } from "@/shared/utils-client";
import Link from "next/link";
import React, { forwardRef, useEffect, useState } from "react";
import { ImNewTab } from "react-icons/im";

interface NavItemProps extends BaseCompProps<"a"> {
    href?: string;
    domain?: string;
}

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
    ({ href, domain, locale, children, className, ...rest }, ref) => {
        const useNewTabIcon = rest.target === "_blank";
        const [hover, setHover] = useState(false);

        const resolvedHref = useResolvedHref(href, locale);
        const [href_, setHref] = useState(resolvedHref);
        useEffect(() => {
            if (domain) {
                setHref(getDomainedOrigin(domain));
            }
        }, [domain]);

        return (
            <Link href={href_} locale={locale} className={tm("relative", className)} ref={ref} {...rest}>
                {useNewTabIcon && hover && (
                    <ImNewTab className="pointer-events-none absolute right-0 top-0 z-10 bg-white text-black" />
                )}
                <IconedText
                    className="flex w-full flex-row justify-center"
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}>
                    {children}
                </IconedText>
            </Link>
        );
    }
);
NavItem.displayName = "NavItem";

export default NavItem;
