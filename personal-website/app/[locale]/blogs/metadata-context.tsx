"use client";
import React, { useEffect } from "react";
import { GetBlogsMetadata } from "../../../components/blogs/graphql";
import Loading from "./loading";
import { fetchBlogsMetadata } from "@/components/blogs/query";

export type BlogsMetadataContextType = GetBlogsMetadata;

const BlogsMetadataContext = React.createContext<BlogsMetadataContextType>(null!);

export const BlogsMetadataProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = React.useState<BlogsMetadataContextType | "loading">("loading");

    useEffect(() => {
        fetchBlogsMetadata().then((data) => {
            console.log("blogs metadata", data);
            setData(data);
        });
    }, []);

    if (data === "loading") {
        return <Loading />;
    }

    return <BlogsMetadataContext.Provider value={data}>{children}</BlogsMetadataContext.Provider>;
};

export const useBlogsMetadata = () => React.useContext(BlogsMetadataContext);
