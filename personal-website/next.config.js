/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        appDir: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s4.anilist.co",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
