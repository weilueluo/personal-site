import { Inter, Source_Sans_Pro } from "next/font/google";

const LARGE_FONT = Inter({
    subsets: ["latin"],
});

const MEDIUM_FONT = Source_Sans_Pro({
    subsets: ["latin"],
    weight: "300",
});

export { LARGE_FONT as L_FONT, MEDIUM_FONT as M_FONT };
