import { redirect } from "next/navigation";

export default function ArchiveLocaleRedirect({ params }: { params: { path?: string[] } }) {
    const rest = params.path?.join("/") ?? "";
    const destination = rest ? `/archive/${rest}` : "/archive";
    redirect(destination);
}
