/** @type {import('next').NextConfig} */
const nextConfig = {
   // output: 'export',
   // Uncomment when add value for NEXT_PUBLIC_PATH in .env.production or .env.development
   // basePath: process.env.NEXT_PUBLIC_PATH,
   trailingSlash: true,
   async rewrites() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      return [
         {
            source: "/api/:path*",
            destination: `${apiUrl}/api/:path*`,
         },
      ]
   },
}

export default nextConfig
