/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        appDir: true,
    },

    sassOptions: {
        logger: {
            warn: function(message) {
                console.warn(message);
            },
            debug: function(message) {
                console.log(message);
            }
        }
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
