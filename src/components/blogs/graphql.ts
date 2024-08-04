// https://docs.github.com/en/graphql/overview/explorer

const query = (str: string) => `query{${str}}`;
export interface Query<T> {
    data: T;
}

const repository = (name: string, owner: string, str: string) => `repository(name:"${name}",owner:"${owner}"){
    id
    openGraphImageUrl
    name
    url
    updatedAt
    stargazerCount
    ${str}}`;
export interface Repository<T> {
    repository: RespositoryContent<T>;
}
export type RespositoryContent<T> = T & {
    id: string;
    openGraphImageUrl: string;
    name: string;
    url: string;
    updatedAt: string;
    stargazerCount: number;
};

const githubObject = (str: string, expr?: string) => {
    if (expr) {
        return `object(expression:${expr}){${str}}`;
    } else {
        return `object{${str}}`;
    }
};
export interface GithubObject<T> {
    object: T;
}

const tree = (str: string) => `... on Tree{id ${str}}`;
export type Tree<T> = T & {
    id: string;
};

const entries = (str: string) => `entries{name path size type lineCount ${str}}`;
export type EntryItem<T> = T & {
    name: string;
    path: string;
    size: number;
    type: string;
    lineCount: number;
};
export interface Entries<T> {
    entries: EntryItem<T>[];
}

const blob = () => `... on Blob{id oid commitUrl commitResourcePath}`;
export type GithubBlob = {
    id: string;
    oid: string;
    commitUrl: string;
    commitResourcePath: string;
};

//////////////////////////////////////////////////////////////////////////////////////////

const node = (id: string | number, str: string | number) => `node(id:"${id}"){id ${str}}`;
export interface Node<T> {
    id: string;
    node: T;
}

const nodes = (str: string | number) => `nodes{${str}}`;
export interface Nodes<T> {
    id: string;
    nodes: T[];
}

const textblob = () => `... on Blob{id oid byteSize commitUrl text isTruncated}`;
export type GithubTextBlob = GithubBlob & {
    byteSize: number;
    commitUrl: string;
    text: string;
    isTruncated: boolean;
};

//////////////////////////////////////////////////////////////////////////////////////////

const searchDiscussion = (query: string, str: string) =>
    `search(query:"${query} in:title repo:${OWNER}/${NAME}",type:DISCUSSION,first:1){${str}}`;
export interface SearchDiscussion<T> {
    search: T;
}

const discussion = (str: string) => `... on Discussion{number ${str}}`;
export type Discussion<T> = T & {
    number: number;
};

const comments = (first: number, after: string, str: string) => `comments(first:${first} after:"${after}"){${str}}`;
export interface Comments<T> {
    comments: T;
}

const pageInfoNodes = (str: string) => `pageInfo{startCursor endCursor hasNextPage hasPreviousPage} nodes{${str}}`;
export interface PageInfoNodes<T> {
    pageInfo: PageInfo;
    nodes: T[];
}
export interface PageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const comment = () => `body createdAt updatedAt url`;
export interface Comment {
    body: string;
    createdAt: string;
    updatedAt: string;
    url: string;
}

const NAME = "blogs";
const OWNER = "weilueluo";

export class GithubGraphQL {
    public static getBlogData = (id: number | string) => {
        return query(node(id, textblob()));
    };
    public static getBlogs = () => {
        return query(repository(NAME, OWNER, githubObject(tree(entries(githubObject(blob()))), '"HEAD:"')));
    };
    public static getBlog = (id: string | number) => {
        return query(node(id, textblob()));
    };
    public static getDiscussion = (q: string, first: number, after: string) => {
        return query(searchDiscussion(q, nodes(discussion(comments(first, after, pageInfoNodes(comment()))))));
    };
}
export type BlogMetadata = EntryItem<GithubObject<GithubBlob>>;
export type GetBlogs = Repository<GithubObject<Tree<Entries<BlogMetadata>>>>;
export type GetBlog = Node<GithubTextBlob>;
export type GetDiscussion = SearchDiscussion<Nodes<Discussion<Comments<PageInfoNodes<Comment>>>>>;
