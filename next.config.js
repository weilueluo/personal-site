/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    test: /\.(glsl|frag|vert)$/,
    use: [
        require.resolve('raw-loader'),
        require.resolve('glslify-loader'),
    ]
}

module.exports = nextConfig