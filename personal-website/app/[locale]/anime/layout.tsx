export default function Layout(props: any) {
    console.log("Layout", props);

    return (
        <>
            {props.modal}
            {props.children}
        </>
    );
}
