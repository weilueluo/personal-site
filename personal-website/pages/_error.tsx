export default function Error({ statusCode }: { statusCode: number }) {
    return <h3>Unlucky Day - {statusCode}</h3>;
}

export { getServerSideProps } from "@/shared/getServerSideProps";
