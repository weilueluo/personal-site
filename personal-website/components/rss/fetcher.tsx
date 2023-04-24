import { isDevEnv } from "@/shared/utils";
import Parser from "rss-parser";

const parser = new Parser();

// https://github.com/Redcxx/cors-proxy
const corsProxyEndpoint = "https://hauww8y4w1.execute-api.eu-west-2.amazonaws.com";

export async function rssFetcher(url: string) {
    const corsURL = corsProxyEndpoint + (isDevEnv() ? "/dev?url=" : "/prod?url=") + url;
    // console.log(`fetching ${corsURL}...`);
    
    return await parser.parseURL(corsURL);
}
