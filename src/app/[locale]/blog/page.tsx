import { fetchBlogContent, getBlogs } from "@/components/blogs/query";
import Separator from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { BlogItem } from "../../../components/blogs/blog-item";

export default async function Page() {
    const blogsPromise = getBlogs();
    const readmePromise = fetchBlogContent("README.md");

    const [blogs, readme] = await Promise.all([blogsPromise, readmePromise]);

    // console.log(blogs.repository.object.entries);
    const readmeText = Buffer.from(readme.content, "base64").toString("utf-8");

    return (
        <div className="flex flex-col items-center justify-center text-xl">
            <h1 className="font-bold">Blogs</h1>
            <Separator className="mb-4 h-2" />
            <ul className="flex w-[80%] flex-col gap-2">
                {blogs.repository.object.entries.map(data => (
                    <BlogItem data={data} key={data.name} />
                ))}
            </ul>
            <Separator className="mb-2 h-2" />
            <h1 className="font-bold">README</h1>
            <Separator className="mb-4 h-2" />
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkToc, remarkGemoji]}
                rehypePlugins={[rehypeRaw, rehypeMathjax]}
                className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                {readmeText}
            </ReactMarkdown>
        </div>
    );
}
