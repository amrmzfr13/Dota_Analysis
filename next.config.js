/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.cloudflare.steamstatic.com',
                pathname: '/apps/dota2/images/**',
            },
        ],
        domains: ['cdn.cloudflare.steamstatic.com'],
    },
};

module.exports = nextConfig; 