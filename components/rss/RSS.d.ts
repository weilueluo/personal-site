
export type RSSOption = {
    url: string;
    limit?: number;
};

export type RSSOptions = Map<string, RSSOption>;

export type FeedsMap = Map<string, Parser.Output<{}>>


declare type OptionalOutput = {
    id?: string;
    author?: string;
};

declare type Extras = {
    name: string
    jsDate: Date
}

export type FlatFeed = Parser.Output<OptionalOutput> & Extras & Parser.Item