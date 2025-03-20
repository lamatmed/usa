/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {}, // Doit être un objet vide ou avec des options spécifiques
    },
    images: {
        remotePatterns: [{
                protocol: "https",
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
            },
        ],
    },
    reactStrictMode: true,
};

module.exports = nextConfig;