import { CourseworkProvider } from "@/components/shader/coursework";
import { BasePageProps } from "@/shared/types/comp";

export default async function Layout({ children, params }: BasePageProps) {
    return <CourseworkProvider>{children}</CourseworkProvider>;
}
