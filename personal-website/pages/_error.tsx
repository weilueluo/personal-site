import { GetServerSideProps, NextPageContext } from "next";
import { getServerSideProps as defaultGetServerSideProps } from "@/shared/getServerSideProps";

interface ErrorProps {
    statusCode: number;
    statusMessage: string;
}

const Error = ({ statusCode, statusMessage }: ErrorProps) => {
    return (
        <div className="m-96 flex w-full flex-col justify-center">
            <h3>Unlucky Day</h3>
            <p>{statusCode}{" | "}{statusMessage}</p>
        </div>
    );
};

Error.displayName = "Error";

export default Error;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { props: defaultProps, ...otherResponse }: any = await defaultGetServerSideProps(context);

    const { res } = context;
    const statusCode = res?.statusCode || 404;
    const statusMessage = res?.statusMessage || "Not Found";

    return {
        ...otherResponse,
        props: {
            ...defaultProps,
            statusCode,
            statusMessage,
        },
    };
};
