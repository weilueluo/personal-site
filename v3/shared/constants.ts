export const GITHUB_REPO_URL = "https://github.com/weilueluo/personal-website";

export const GITHUB_CV_URL = "https://github.com/weilueluo/cv/blob/master/resume.pdf";

export type LOCALE_TYPE = "en" | "zh" | "jp" | "hi" | "iw" | "tw";
export const LOCALES: LOCALE_TYPE[] = ["en", "zh", "jp", "hi", "iw", "tw"];
export const LOCALE_DISPLAY_MAP: Record<LOCALE_TYPE, string> = {
    en: "English",
    zh: "中文",
    jp: "日本語",
    hi: "हिंदी",
    iw: "עברית",
    tw: "繁體中文",
};
export const DEFAULT_LOCALE = "en";
