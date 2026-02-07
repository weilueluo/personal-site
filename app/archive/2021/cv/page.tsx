import { readFile } from "node:fs/promises";
import path from "node:path";
import Archive2021CVClient from "./client";

export default async function Archive2021CV() {
    const resumePath = path.join(process.cwd(), "archive", "2021", "components", "cv", "resume.html");
    const cvContent = await readFile(resumePath, { encoding: "utf-8" });

    return <Archive2021CVClient cvContent={cvContent} />;
}
