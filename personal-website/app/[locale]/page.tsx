import Header from "@/components/header/Header";

export default async function Page({ params }: { params: { locale: string } }) {
    // const msgs: any = await getTranslation(params.locale);

    return (
        <>
            <Header locale={params.locale} />
        </>
    );
}
