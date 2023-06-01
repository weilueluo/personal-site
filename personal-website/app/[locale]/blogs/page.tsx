import Separator from "@/components/ui/Separator";
import { BlogItem } from "./blog-item";
import { fetchBlogDirectory } from "@/components/blogs/query";

export default async function Page() {
    const data = await fetchBlogDirectory();

    return (
        <div className="flex flex-col items-center justify-center text-xl">
            <h1 className="font-bold">Blogs</h1>
            <Separator className="mb-4 h-2" />
            <ul className="flex flex-col gap-2">
                {data.map((data) => (
                    <BlogItem filename={data.name} key={data.name} />
                ))}
            </ul>
        </div>
    );
}
