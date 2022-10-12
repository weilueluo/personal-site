import Parser from "rss-parser";
import {
    toStartOfTheDay,
    toMonday,
    toStartOfMonth,
    toStartOfYear
} from './Utils'

export type RSSOption = {
    name: string
    url: string;
};

export type FeedsMap = Map<string, Parser.Output<{}>>

declare type Extras = {
    name: string
    jsDate?: Date
    uniqueKey: string
    id?: string
    author?: string
}

export type FlatFeed = Parser.Output<{}> & Extras & Parser.Item

export type RSSRequestError = {
    message: string
    stack: string
    url: string
}

export type Filter = {
    displayName: string
    name: string
    active: boolean
}

export type FilterSection = {
    displayName: string
    name: string
    filters: Filter[]
}