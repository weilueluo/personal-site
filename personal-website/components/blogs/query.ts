// written on top of graphql.ts to fetch graphql query from github

import { GetBlogData, GetBlogsMetadata as GetBlogsMetadata, GithubGraphQL } from "./graphql";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const PUBLIC_GITHUB_ACCESS_TOKEN =
    "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";

const fetchGithubData = async <T>(query: string) => {
    console.log("query", query);

    return fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLIC_GITHUB_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            query,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.errors) {
                throw new Error(JSON.stringify(res.errors));
            }
            return res.data as T;
        });
};

export const fetchBlogsMetadata = async () => {
    const query = GithubGraphQL.getBlogsMetadata();
    const res = await fetchGithubData<GetBlogsMetadata>(query);

    return res;
};

export const fetchBlogData = async (id: number | string) => {
    const query = GithubGraphQL.getBlogData(id);
    const res = await fetchGithubData<GetBlogData>(query);

    return res;
};
