import Parser from "rss-parser";

export type RSSOption = {
    url: string;
    limit?: number;
};

export type RSSOptions = Map<string, RSSOption>;

export type FeedsMap = Map<string, Parser.Output<{}>>

declare type Extras = {
    name: string
    jsDate: Date
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