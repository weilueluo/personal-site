import { useState, useEffect } from 'react'

// export function useHover(ref) {
//     const [hovered, setHover] = useState(false);
//     const mouseOverHandler = () => setHover(true);
//     const mouseOutHandler = () => setHover(false);

//     useEffect(() => {
//         const node = ref.current;
//         if (node) {
//             node.addEventListener('mouseover', mouseOverHandler);
//             node.addEventListener('mouseout', mouseOutHandler);
//             return () => {
//                 node.removeEventListener('mouseover', mouseOverHandler);
//                 node.removeEventListener('mouseout', mouseOutHandler);
//             }
//         }
//     }, ref.current);

//     return hovered;
// }

export function useHoverThree(ref) {
    const [hovered, setHover] = useState(false);
    const mouseOverHandler = () => setHover(true);
    const mouseOutHandler = () => setHover(false);

    useEffect(() => {
        const node = ref.current;
        console.log("IF");
        console.log(node);
        console.log(node.events);
        if (node) {
            node.addEventListener('pointerover', mouseOverHandler);
            node.addEventListener('pointerout', mouseOutHandler);
            return () => {
                node.removeEventListener('pointerover', mouseOverHandler);
                node.removeEventListener('pointerout', mouseOutHandler);
            }
        } else {
            console.log("else");
            console.log(node);
        }
    }, ref.current);

    return hovered;
}