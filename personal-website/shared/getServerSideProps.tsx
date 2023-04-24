import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req: { cookies }, locale }) => {
    const messages = (await import(`../public/messages/${locale}.json`)).default;

    return {
        props: {
            cookies,
            messages,
        },
    };
};
