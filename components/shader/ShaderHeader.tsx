"use client";
import { Messages } from "@/shared/i18n/type";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { BiTargetLock } from "react-icons/bi";
import { BsShadows } from "react-icons/bs";
import { GiFilmProjector, GiShieldReflect } from "react-icons/gi";
import { IoIosColorPalette, IoIosCut } from "react-icons/io";
import { IoLayers } from "react-icons/io5";
import { MdBlurOn, MdGroupWork, MdLightbulb, MdScatterPlot } from "react-icons/md";
import { PiPath, PiWaveTriangleFill } from "react-icons/pi";
import { RiColorFilterFill } from "react-icons/ri";
import { TbBounceLeftFilled, TbFence, TbTriangleSquareCircleFilled } from "react-icons/tb";
import IconedText from "../ui/icon-text";
import { useCoursework } from "./coursework";

export interface ShaderHeaderProps extends BaseCompProps<"div"> {
    messages: Messages;
}

export default function ShaderHeader({ messages }: ShaderHeaderProps) {
    const { type, toggleType, options, toggleOption } = useCoursework();

    if (!messages) return null;

    const isRayTracer = type === "ray tracer";
    const isRasterization = type === "rasterization";
    const isPathTracer = type === "path tracer";

    return (
        <div>
            <div className="flex flex-row justify-center gap-4">
                <IconedText active={isRayTracer} onClick={() => toggleType("ray tracer")}>
                    <GiShieldReflect />
                    Ray Tracer
                </IconedText>
                <IconedText active={isRasterization} onClick={() => toggleType("rasterization")}>
                    <TbFence />
                    Rasterization
                </IconedText>
                <IconedText active={isPathTracer} onClick={() => toggleType("path tracer")}>
                    <PiPath />
                    Path Tracer
                </IconedText>
            </div>
            <div>
                <div
                    className={tm(
                        "mt-2 flex flex-row flex-wrap justify-around gap-2 md:gap-4",
                        !isRayTracer && "hidden"
                    )}>
                    <IconedText
                        active={options.includes("Cylinder And Plane")}
                        onClick={() => toggleOption("Cylinder And Plane")}>
                        <TbTriangleSquareCircleFilled />
                        Cylinder And Plane
                    </IconedText>
                    <IconedText
                        active={options.includes("Reflect And Refract")}
                        onClick={() => toggleOption("Reflect And Refract")}>
                        <PiWaveTriangleFill />
                        Reflect And Refract
                    </IconedText>
                    <IconedText active={options.includes("Fresnel")} onClick={() => toggleOption("Fresnel")}>
                        <BsShadows />
                        Fresnel
                    </IconedText>
                </div>
                <div
                    className={tm(
                        "mt-4 flex flex-row flex-wrap justify-around gap-2 md:gap-4",
                        !isRasterization && "hidden"
                    )}>
                    <IconedText active={options.includes("Projection")} onClick={() => toggleOption("Projection")}>
                        <GiFilmProjector />
                        Projection
                    </IconedText>
                    <IconedText
                        active={options.includes("Rasterization")}
                        onClick={() => toggleOption("Rasterization")}>
                        <TbFence />
                        Rasterization
                    </IconedText>
                    <IconedText active={options.includes("Clipping")} onClick={() => toggleOption("Clipping")}>
                        <IoIosCut />
                        Clipping
                    </IconedText>
                    <IconedText
                        active={options.includes("Interpolation")}
                        onClick={() => toggleOption("Interpolation")}>
                        <RiColorFilterFill />
                        Interpolation
                    </IconedText>
                    <IconedText active={options.includes("Zbuffering")} onClick={() => toggleOption("Zbuffering")}>
                        <IoLayers />
                        Zbuffering
                    </IconedText>
                    <IconedText active={options.includes("AAlias")} onClick={() => toggleOption("AAlias")}>
                        <MdBlurOn />
                        AAlias
                    </IconedText>
                </div>
                <div
                    className={tm(
                        "mt-4 flex flex-row flex-wrap justify-around gap-2 md:gap-4",
                        !isPathTracer && "hidden"
                    )}>
                    <IconedText active={options.includes("Light")} onClick={() => toggleOption("Light")}>
                        <MdLightbulb />
                        Light
                    </IconedText>
                    <IconedText active={options.includes("Bounce")} onClick={() => toggleOption("Bounce")}>
                        <TbBounceLeftFilled />
                        Bounce
                    </IconedText>
                    <IconedText active={options.includes("Throughput")} onClick={() => toggleOption("Throughput")}>
                        <IoIosColorPalette />
                        Throughput
                    </IconedText>
                    <IconedText active={options.includes("Halton")} onClick={() => toggleOption("Halton")}>
                        <MdScatterPlot />
                        Halton
                    </IconedText>
                    <IconedText active={options.includes("AAlias")} onClick={() => toggleOption("AAlias")}>
                        <MdBlurOn />
                        AAlias
                    </IconedText>
                    <IconedText
                        active={options.includes("Importance Sampling")}
                        onClick={() => toggleOption("Importance Sampling")}>
                        <BiTargetLock />
                        Importance Sampling
                    </IconedText>
                    <IconedText
                        active={options.includes("Multi-light IS")}
                        onClick={() => toggleOption("Multi-light IS")}>
                        <MdGroupWork />
                        Multi-light IS
                    </IconedText>
                </div>
            </div>
        </div>
    );
}
