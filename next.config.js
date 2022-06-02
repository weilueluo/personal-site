/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // test: /\.(glsl|frag|vert)$/,
    // use: [
    //     require.resolve('raw-loader'),
    //     require.resolve('glslify-loader'),
    // ]
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            use: ['raw-loader', 'glslify-loader'],
        });

        return config;
    }
}

module.exports = nextConfig