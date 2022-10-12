/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,  // not supported for exporting static page using "next export"
    },
    publicRuntimeConfig: {
        buildTime: new Date()
    },
    webpack: (config, options) => {

        // for compling shaders
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            use: ['raw-loader', 'glslify-loader'],
        });

        return config;
    }
}

module.exports = nextConfig



// const babelConfig = {
//     "presets": ["next/babel"],
//     "plugins": ["preval", "macros"] // for pre-evaluate build time, to be shown in about page
// }


// module.exports = babelConfig

// // https://github.com/facebook/relay/issues/2648#issuecomment-499250143