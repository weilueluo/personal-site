import { useState } from "react";

export function useForceUpdate() {
    const [, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update state to force render
}
