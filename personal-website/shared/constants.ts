import { LocaleAnalysisResult } from "next/dist/server/future/helpers/i18n-provider";

export const GITHUB_REPO_URL = "https://github.com/weilueluo/personal-website";

export const GITHUB_CV_URL = "https://github.com/weilueluo/cv/blob/master/resume.pdf";

export type LOCALE_TYPE = "en" | "zh" | "jp";
export const LOCALES: LOCALE_TYPE[] = ["en", "zh", "jp"];
export const LOCALE_DISPLAY_MAP: Record<LOCALE_TYPE, string> = {
    en: "English",
    zh: "中文",
    jp: "日本語",
};
export const DEFAULT_LOCALE = "en";
