/** @type {import('next').NextConfig} */

const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});
const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

const nextConfig = withNextIntl(
    withBundleAnalyzer({
        sassOptions: {
            includePaths: [path.join(process.cwd(), "archive", "2021")],
            logger: {
                warn: function (message) {
                    console.warn(message);
                },
                debug: function (message) {
                    console.log(message);
                },
            },
        },
        images: {
            remotePatterns: [
                {
                    protocol: "https",
                    hostname: "s4.anilist.co",
                    port: "",
                },
            ],
            unoptimized: true, // avoid vercel optimization billing
        },
        env: {
            NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
        },
        webpack: (config) => {
            config.module.rules.push({
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: "asset/source",
            });

            // Work around Windows EINVAL lstat errors (e.g. `C:\\hiberfil.sys`) during Watchpack's initial scan.
            // These are OS-managed files that cannot be stat'ed like normal files.
            if (process.platform === "win32") {
                const extraIgnored = [
                    /[\\/]DumpStack\.log\.tmp$/,
                    /[\\/]hiberfil\.sys$/,
                    /[\\/]pagefile\.sys$/,
                    /[\\/]swapfile\.sys$/,
                ];

                config.watchOptions = config.watchOptions || {};
                const currentIgnored = config.watchOptions.ignored;
                if (!currentIgnored) {
                    config.watchOptions.ignored = extraIgnored;
                } else if (Array.isArray(currentIgnored)) {
                    config.watchOptions.ignored = [...currentIgnored, ...extraIgnored];
                } else {
                    config.watchOptions.ignored = [currentIgnored, ...extraIgnored];
                }
            }

            return config;
        },
    })
);

module.exports = nextConfig;
