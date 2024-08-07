"use client";
import {
    DescribeTableCommand,
    DescribeTableCommandOutput,
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandOutput,
    QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface Comment {
    name: string;
    content: string;
    time: number;
}

export class CommentService {
    private client: DynamoDBClient;

    constructor(identityPoolId: string, private readonly tableName: string) {
        this.client = new DynamoDBClient({
            region: "eu-west-2",
            credentials: fromCognitoIdentityPool({
                identityPoolId: identityPoolId, //process.env.NEXT_PUBLIC_COMMENT_COGNITO_POOL_ID ?? "",
                clientConfig: { region: "eu-west-2" },
            }),
        });
    }

    async describeTable(): Promise<DescribeTableCommandOutput> {
        return this.client.send(new DescribeTableCommand({ TableName: this.tableName }));
    }

    async addComment(name: string, content: string): Promise<PutItemCommandOutput> {
        if (!(name && content)) {
            return Promise.reject("name and content must be provided");
        }
        return this.client.send(
            new PutItemCommand({
                TableName: this.tableName,
                Item: {
                    name: {
                        S: name,
                    },
                    content: {
                        S: content,
                    },
                    time: {
                        N: Date.now().toString(),
                    },
                },
            })
        );
    }

    async getComments(name: string): Promise<Comment[]> {
        return this.client
            .send(
                new QueryCommand({
                    TableName: this.tableName,
                    KeyConditionExpression: "#name = :name",
                    ExpressionAttributeValues: {
                        ":name": {
                            S: name,
                        },
                    },
                    ExpressionAttributeNames: {
                        "#name": "name",
                    },
                })
            )
            .then(data => {
                return (
                    data.Items?.map(item => {
                        return {
                            name: item.name.S,
                            content: item.content.S,
                            time: Number(item.time.N),
                        } as Comment;
                    }) || []
                );
            })
            .catch(err => {
                console.error("error while fetching comments");
                console.error(err);
                return [];
            });
    }
}

export function useComments(identityPoolId: string, tableName: string, filename: string) {
    const commentService = useMemo(() => new CommentService(identityPoolId, tableName), [identityPoolId, tableName]);

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const reload = useCallback(async () => {
        setLoading(true);
        console.log("reloading comments");
        console.log("filename", filename);
        console.log("tableName", tableName);
        console.log("identityPoolId", identityPoolId);
        const comments = await commentService.getComments(filename);
        setComments(comments);
        setLoading(false);
    }, [commentService, filename, tableName, identityPoolId]);
    const sendComment = useCallback(
        async (content: string) => {
            await commentService.addComment(filename, content);
            await reload();
        },
        [filename, commentService, reload]
    );

    return { comments, loading, reload, sendComment };
}
