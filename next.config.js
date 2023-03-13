/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true,
        reactAnimations: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            },
            {
                protocol: 'http',
                hostname: '**'
            }
        ],
    },
}

module.exports = nextConfig
