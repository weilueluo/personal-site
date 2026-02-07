import Link from "next/link";

export default function ArchiveIndex() {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-6 py-12">
            <h1 className="text-2xl font-semibold">Archive</h1>
            <p className="text-sm text-gray-600">Legacy versions preserved under their original routes.</p>
            <div className="flex flex-col gap-2">
                <Link href="/archive/2021" className="underline">
                    2021 site
                </Link>
                <Link href="/archive/2019/index.html" className="underline">
                    2019 site
                </Link>
            </div>
        </div>
    );
}
