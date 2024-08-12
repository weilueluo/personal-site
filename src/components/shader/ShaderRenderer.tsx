"use client";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import Script from "next/script";
import { useEffect, useState } from "react";
import { MdSpeed } from "react-icons/md";
import IconedText from "../ui/icon-text";
import Loading from "../ui/loading/spinner";
import Separator from "../ui/separator";
import { TYPE_2_SOLUTION, useCoursework } from "./coursework";
import { ShaderFramework } from "./shaderFramework";

const COURSEWORK_TYPE_2_FRAG_SHADER = {
    "ray tracer": "cwk1-fragment-shader",
    rasterization: "cwk2-fragment-shader",
    "path tracer": "cwk3-fragment-shader",
};

const COURSEWORK_TYPE_2_VERT_SHADER = {
    "ray tracer": "cwk1-vertex-shader",
    rasterization: "cwk2-vertex-shader",
    "path tracer": "cwk3-vertex-shader",
};

export default function ShaderRenderer(params: BaseCompProps<"div">) {
    const [framework, setFramework] = useState<ShaderFramework | undefined>(undefined);
    const { type, options, processing, setProcessing } = useCoursework();
    const [frames, setFrames] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const canvasId = "courseworkCanvas";

    useEffect(() => {
        setFramework(prevFramework => {
            setProcessing(true);
            if (prevFramework) {
                prevFramework.stop();
            }
            if (type === undefined) {
                console.warn("No coursework type selected");
                return undefined;
            }
            const isPathTracer = type === "path tracer";
            const newFramework = new ShaderFramework(
                canvasId,
                COURSEWORK_TYPE_2_VERT_SHADER[type],
                COURSEWORK_TYPE_2_FRAG_SHADER[type],
                isPathTracer,
                isPathTracer ? "cwk3-tonemap-shader" : undefined
            );
            options.map(opt => TYPE_2_SOLUTION[opt]).forEach(opt => newFramework.addSolution(opt));

            const maxFrames = isPathTracer ? 1000 : 1;
            setStartTime(Date.now());
            setFrames(0);
            newFramework.setFrameCallback(() => {
                setFrames(newFramework.getCurrentFrame());
            });
            newFramework
                .initialize()
                .then(() => newFramework.start(maxFrames))
                .then(() => setProcessing(false));
            return newFramework;
        });
    }, [type, options, setProcessing]);

    return (
        <>
            <Separator className="mb-2 h-2" />
            <div className={tm("relative mt-4 flex flex-col items-center")}>
                <canvas
                    id={canvasId}
                    className={tm("w-full border-4 border-black md:w-4/5", processing && "brightness-50")}></canvas>

                {processing && <Loading className="absolute  left-0 top-0 z-10 h-full w-full fill-black" />}
                <IconedText hover={false}>
                    <MdSpeed />
                    <span className="secondary-text">
                        {frames}/{framework?.getMaxFrame()} frames | {getFps(startTime, frames)} fps
                    </span>
                </IconedText>
                <span className="secondary-text z-10">*This runs in real-time on your machine</span>
            </div>
            <Script
                id="cwk1-fragment-shader"
                type="x-shader/x-fragment"
                src="/shaders/cwk1/fragmentShader.glsl"></Script>
            <Script id="cwk1-vertex-shader" type="x-shader/x-vertex" src="/shaders/cwk1/vertexShader.glsl"></Script>
            <Script
                id="cwk2-fragment-shader"
                type="x-shader/x-fragment"
                src="/shaders/cwk2/fragmentShader.glsl"></Script>
            <Script id="cwk2-vertex-shader" type="x-shader/x-vertex" src="/shaders/cwk2/vertexShader.glsl"></Script>

            <Script
                id="cwk3-fragment-shader"
                type="x-shader/x-fragment"
                src="/shaders/cwk3/fragmentShader.glsl"></Script>
            <Script id="cwk3-vertex-shader" type="x-shader/x-vertex" src="/shaders/cwk3/vertexShader.glsl"></Script>
            <Script id="cwk3-tonemap-shader" type="x-shader/x-fragment" src="/shaders/cwk3/tonemapShader.glsl"></Script>
        </>
    );
}

function getFps(startTime: number, frames: number) {
    const time = Date.now() - startTime;
    return Math.floor((frames / time) * 1000);
}
