import { BlogsMetadataProvider } from "./metadata-context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <BlogsMetadataProvider>{children}</BlogsMetadataProvider>;
}
