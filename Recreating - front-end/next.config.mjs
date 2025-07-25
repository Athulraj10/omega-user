const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return []; // Don't rewrite in dev
    }

    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
