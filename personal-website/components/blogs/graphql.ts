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

const entries = (str: string) => `entries{name ${str}}`;
export type EntryItem<T> = T & {
    name: string;
};
export interface Entries<T> {
    entries: EntryItem<T>[];
}

const blob = () => `... on Blob{id oid}`;
export type GithubBlob = {
    id: string;
    oid: string;
};

//////////////////////////////////////////////////////////////////////////////////////////

const node = (id: string | number, str: string | number) => `node(id:"${id}"){id ${str}}`;
export interface Node<T> {
    id: string;
    node: T;
}

const textblob = () => `... on Blob{id oid byteSize commitUrl text isTruncated}`;
export type GithubTextBlob = GithubBlob & {
    byteSize: number;
    commitUrl: string;
    text: string;
    isTruncated: boolean;
};

//////////////////////////////////////////////////////////////////////////////////////////

const NAME = "ucl-notes";
const OWNER = "weilueluo";

export class GithubGraphQL {
    public static getBlogsMetadata = () => {
        return query(repository(NAME, OWNER, githubObject(tree(entries(githubObject(blob()))), '"HEAD:"')));
    };
    public static getBlogData = (id: number | string) => {
        return query(node(id, textblob()));
    };
}
// getBlogsMetadata
export type GithubBlogEntry = EntryItem<GithubObject<GithubBlob>>;
export type GetBlogsMetadata = Repository<GithubObject<Tree<Entries<GithubBlogEntry>>>>;
// getBlogData
export type GetBlogData = Node<GithubTextBlob>;
