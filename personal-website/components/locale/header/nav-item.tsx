"use client";

import { useResolvedHref } from "@/shared/i18n/locale";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import Link from "next/link";
import React, { forwardRef } from "react";
import { ImNewTab } from "react-icons/im";

interface NavItemProps extends BaseCompProps<"a"> {
    href?: string;
}

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(({ href, locale, children, className, ...rest }, ref) => {
    const useNewTabIcon = rest.target === "_blank";
    const [hover, setHover] = React.useState(false);

    href = useResolvedHref(href, locale);

    return (
        <Link
            href={href}
            locale={locale}
            className={tm("icon-text std-pad std-hover relative", className)}
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            {...rest}>
            {useNewTabIcon && hover && (
                <ImNewTab className="pointer-events-none absolute right-0 top-0 z-10 bg-white" />
            )}
            {children}
        </Link>
    );
});
NavItem.displayName = "NavItem";

export default NavItem;
