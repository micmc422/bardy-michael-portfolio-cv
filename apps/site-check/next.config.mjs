/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/utils", "@repo/seo-resources"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
      }
    ],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect portfolio routes to main site
      {
        source: "/a-propos",
        destination: "https://occitaweb.fr/a-propos",
        permanent: true,
        basePath: false
      },
      {
        source: "/realisations/:path*",
        destination: "https://occitaweb.fr/realisations/:path*",
        permanent: true,
        basePath: false
      },
      {
        source: "/estimation/:path*",
        destination: "https://occitaweb.fr/estimation/:path*",
        permanent: true,
        basePath: false
      },
      // Redirect blog routes to blog subdomain
      {
        source: "/blog/:path*",
        destination: "https://blog.occitaweb.fr/:path*",
        permanent: true,
        basePath: false
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
