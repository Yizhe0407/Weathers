/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://backend:3001/:path*', // Proxy to Backend API
            },
        ];
    },
};

export default nextConfig;
