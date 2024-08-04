// written on top of graphql.ts to fetch graphql query from github

import { GetBlog, GetBlogs, GetDiscussion, GithubGraphQL } from "./graphql";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_REST_ENDPOINT = "https://api.github.com";
const OWNER = "weilueluo";
const REPO = "blogs";

// read only on public repo, free to expose this to public
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchGithubGraphQLData = async <T>(query: string) => {
    console.log("query github graphql", query);

    return fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
            query,
        }),
    })
        .then(res => res.json())
        .then(res => {
            if (res.errors) {
                throw new Error(JSON.stringify(res.errors));
            }
            return res.data as T;
        });
};

export const getBlogs = async (): Promise<GetBlogs> => {
    const query = GithubGraphQL.getBlogs();
    return fetchGithubGraphQLData<GetBlogs>(query);
};

export const getBlog = async (id: number | string): Promise<GetBlog> => {
    const query = GithubGraphQL.getBlog(id);
    return fetchGithubGraphQLData(query);
};

export const getDiscussion = async (q: string, first: number, after: string): Promise<GetDiscussion> => {
    const query = GithubGraphQL.getDiscussion(q, first, after);
    // console.log("query", query);
    return fetchGithubGraphQLData<GetDiscussion>(query);
};

const fetchGithubRestData = async <T>(path: string) => {
    console.log("query github rest", path);
    return fetch(`${GITHUB_REST_ENDPOINT}${path}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        next: {
            revalidate: 60 * 10, // revalidate every 10 minutes
        },
    }).then(res => res.json() as T);
};

// export const fetchBlogData = async (id: number | string) => {
//     const query = GithubGraphQL.getBlogData(id);
//     const res = await fetchGithubData<GetBlogData>(query);

//     return res;
// };

export const fetchBlogDirectory = async (): Promise<FetchBlogDirectory> => {
    // const query = GithubGraphQL.getBlogsMetadata();
    // const res = await fetchGithubGraphQLData<GetBlogsMetadata>(query);
    // return res.repository.object.entries
    //     .filter((entry) => entry.name.endsWith(".md"));
    return fetchGithubRestData<FetchBlogDirectory>(`/repos/${OWNER}/${REPO}/contents/`);
};

export type BlogDirectory = Omit<FetchBlogContent, "text" | "encoding">;
export type FetchBlogDirectory = BlogDirectory[];

//////////////////////////////////////////////////////////////////////////////////////////

export const fetchBlogContent = async (filename: string): Promise<FetchBlogContent> => {
    return fetchGithubRestData<FetchBlogContent>(`/repos/${OWNER}/${REPO}/contents/${filename}`);
};
export interface FetchBlogContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    content: string;
    encoding: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
}

//////////////////////////////////////////////////////////////////////////////////////////

export const fetchBlogCommit = async (filename: string): Promise<FetchBlogCommit> => {
    return fetchGithubRestData<FetchBlogCommit>(`/repos/${OWNER}/${REPO}/commits?path=${filename}`);
};
export interface User {
    name: string;
    email: string;
    date: string;
}
export interface Author {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
interface Commit {
    author: User;
    committer: User;
    message: string;
    tree: {
        sha: string;
        url: string;
    };
    url: string;
    comment_count: number;
    verification: {
        verified: boolean;
        reason: string;
        signature: string;
        payload: string;
    };
}
export interface ParentItem {
    sha: string;
    url: string;
    html_url: string;
}
export type Parent = ParentItem[];
export interface FetchBlogCommitItem {
    sha: string;
    node_id: string;
    commit: Commit;
    url: string;
    html_url: string;
    comments_url: string;
    author: Author;
    committer: Author;
    parents: Parent;
}
export type FetchBlogCommit = FetchBlogCommitItem[];
