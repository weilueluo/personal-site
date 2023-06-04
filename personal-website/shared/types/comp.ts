import { ComponentPropsWithRef, ElementType } from "react";
import { Messages } from "../i18n/type";
import { LOCALE_TYPE } from "../constants";

export interface BaseParams {
    locale: LOCALE_TYPE;
}

export interface BasePageProps {
    params: BaseParams;
    children?: React.ReactNode;
}

export type BaseCompProps<T extends ElementType> = ComponentPropsWithRef<T> & {
    messages: Messages;
    locale: LOCALE_TYPE;
};
