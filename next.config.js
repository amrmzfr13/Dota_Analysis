/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.cloudflare.steamstatic.com',
                pathname: '/apps/dota2/images/**',
            },
            {
                protocol: 'https',
                hostname: 'api.opendota.com',
                pathname: '/apps/dota2/images/**',
            }
        ]
    },
};

module.exports = nextConfig; 