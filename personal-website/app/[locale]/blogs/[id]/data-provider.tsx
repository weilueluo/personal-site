"use client";

import { GetBlogData } from "@/components/blogs/graphql";
import { fetchBlogData } from "@/components/blogs/query";
import React, { useEffect } from "react";
import Loading from "../loading";

export type BlogDataContextType = GetBlogData;

const BlogDataContext = React.createContext<BlogDataContextType>(null!);

export const BlogDataProvider = ({ id, children }: { id: number | string; children: React.ReactNode }) => {
    const [data, setData] = React.useState<BlogDataContextType | "loading">("loading");

    useEffect(() => {
        fetchBlogData(id).then((data) => {
            console.log("blog data", data);
            setData(data);
        });
    }, [id]);

    if (data === "loading") {
        return <Loading />;
    }

    return <BlogDataContext.Provider value={data}>{children}</BlogDataContext.Provider>;
};

export const useBlogData = () => React.useContext(BlogDataContext);
