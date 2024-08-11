"use client";
import { Messages } from "@/shared/i18n/type";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { GiFilmProjector, GiShieldReflect } from "react-icons/gi";
import { IoIosCut } from "react-icons/io";
import { IoLayers } from "react-icons/io5";
import { MdBlurOn, MdDeblur, MdGroupWork, MdLightbulb, MdScatterPlot } from "react-icons/md";
import { PiPath, PiWaveTriangleFill } from "react-icons/pi";
import { RiColorFilterFill } from "react-icons/ri";
import { TbBounceLeftFilled, TbFence, TbTriangleSquareCircleFilled } from "react-icons/tb";
import IconedText from "../ui/icon-text";
import { useCoursework } from "./coursework";
import { IoIosColorPalette } from "react-icons/io";
import { BiTargetLock } from "react-icons/bi";

export interface ShaderHeaderProps extends BaseCompProps<"div"> {
    messages: Messages;
}

export default function ShaderHeader({ messages }: ShaderHeaderProps) {
    const { active, setActive, activeOptions, selectOption } = useCoursework();

    if (!messages) return null;

    const isRayTracer = active === "ray tracer";
    const isRasterization = active === "rasterization";
    const isPathTracer = active === "path tracer";

    return (
        <div>
            <div className="flex flex-row justify-center gap-4">
                <IconedText active={isRayTracer} onClick={() => setActive("ray tracer")}>
                    <GiShieldReflect />
                    Ray Tracer
                </IconedText>
                <IconedText active={isRasterization} onClick={() => setActive("rasterization")}>
                    <TbFence />
                    Rasterization
                </IconedText>
                <IconedText active={isPathTracer} onClick={() => setActive("path tracer")}>
                    <PiPath />
                    Path Tracer
                </IconedText>
            </div>
            <div>
                <div className={tm("mt-4 flex flex-row flex-wrap justify-around gap-4", !isRayTracer && "hidden")}>
                    <IconedText
                        active={activeOptions.includes("Cylinder And Plane")}
                        onClick={() => selectOption("Cylinder And Plane")}>
                        <TbTriangleSquareCircleFilled />
                        Cylinder And Plane
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Reflect And Refract")}
                        onClick={() => selectOption("Reflect And Refract")}>
                        <PiWaveTriangleFill />
                        Reflect And Refract
                    </IconedText>
                    <IconedText active={activeOptions.includes("Fresnel")} onClick={() => selectOption("Fresnel")}>
                        <MdDeblur />
                        Fresnel
                    </IconedText>
                </div>
                <div className={tm("mt-4 flex flex-row flex-wrap justify-around gap-4", !isRasterization && "hidden")}>
                    <IconedText
                        active={activeOptions.includes("Projection")}
                        onClick={() => selectOption("Projection")}>
                        <GiFilmProjector />
                        Projection
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Rasterization")}
                        onClick={() => selectOption("Rasterization")}>
                        <TbFence />
                        Rasterization
                    </IconedText>
                    <IconedText active={activeOptions.includes("Clipping")} onClick={() => selectOption("Clipping")}>
                        <IoIosCut />
                        Clipping
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Interpolation")}
                        onClick={() => selectOption("Interpolation")}>
                        <RiColorFilterFill />
                        Interpolation
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Zbuffering")}
                        onClick={() => selectOption("Zbuffering")}>
                        <IoLayers />
                        Zbuffering
                    </IconedText>
                    <IconedText active={activeOptions.includes("AAlias")} onClick={() => selectOption("AAlias")}>
                        <MdBlurOn />
                        AAlias
                    </IconedText>
                </div>
                <div className={tm("mt-4 flex flex-row flex-wrap justify-around gap-4", !isPathTracer && "hidden")}>
                    <IconedText active={activeOptions.includes("Light")} onClick={() => selectOption("Light")}>
                        <MdLightbulb />
                        Light
                    </IconedText>
                    <IconedText active={activeOptions.includes("Bounce")} onClick={() => selectOption("Bounce")}>
                        <TbBounceLeftFilled />
                        Bounce
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Throughput")}
                        onClick={() => selectOption("Throughput")}>
                        <IoIosColorPalette />
                        Throughput
                    </IconedText>
                    <IconedText active={activeOptions.includes("Halton")} onClick={() => selectOption("Halton")}>
                        <MdScatterPlot />
                        Halton
                    </IconedText>
                    <IconedText active={activeOptions.includes("AAlias")} onClick={() => selectOption("AAlias")}>
                        <MdBlurOn />
                        AAlias
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Importance Sampling")}
                        onClick={() => selectOption("Importance Sampling")}>
                        <BiTargetLock />
                        Importance Sampling
                    </IconedText>
                    <IconedText
                        active={activeOptions.includes("Multi-light IS")}
                        onClick={() => selectOption("Multi-light IS")}>
                        <MdGroupWork />
                        Multi-light IS
                    </IconedText>
                </div>
            </div>
        </div>
    );
}
