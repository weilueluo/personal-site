/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
    experimental: {
        appDir: true,
    },

    sassOptions: {
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

    eslint: {
        // eslint ran during pre-commit hooks
        ignoreDuringBuilds: true,
    },

    output: "standalone",
});

module.exports = nextConfig;
