import Header from "@/components/header/Header";
import { tm } from "@/shared/utils";
import { GetServerSideProps } from "next";

export default function Page() {
    // const { resolvedTheme } = useTheme();

    return (
        <main className={tm("max-w-screen min-h-screen p-6 md:p-24")}>
            <Header />
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req: { cookies }, locale }) => {
    const messages = (await import(`../public/messages/${locale}.json`)).default;

    return {
        props: {
            cookies,
            messages,
        },
    };
};
