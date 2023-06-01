import Separator from "@/components/ui/Separator";
import { BlogItem } from "./blog-item";
import { fetchBlogDirectory } from "@/components/blogs/query";

export default async function Page() {
    const data = await fetchBlogDirectory();

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-xl">
            <h1 className="font-bold">Blogs</h1>
            <Separator className="mb-2 h-0" />
            <ul className="flex flex-col gap-2">
                {data.map((data) => (
                    <BlogItem filename={data.name} key={data.name} />
                ))}
            </ul>
        </div>
    );
}
