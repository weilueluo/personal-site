import { LOADING_IMAGE_PATH } from "../../common/constants";
import Card from "./CardLI";



export default function LoadingCard() {
    return (
        <Card imageUrl={LOADING_IMAGE_PATH} alt='loading' />
    )
}