import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/utils"],
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
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      }
    ],
    localPatterns: [
      {
        pathname: "/api/og/**",
      },
      {
        pathname: "/og/**",
      },
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
      {
        source: "/solutions/:path*",
        destination: "https://occitaweb.fr/solutions/:path*",
        permanent: true,
        basePath: false
      },
      // Redirect site-check routes to SEO subdomain
      {
        source: "/site-check/:path*",
        destination: "https://seo.occitaweb.fr/:path*",
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

export default withMDX(nextConfig);
