import mdx from "@next/mdx";
import remarkGfm from 'remark-gfm'

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/about/:path*",
        destination: "/a-propos/:path*",
        permanent: true
      },
      {
        source: "/work/:path*",
        destination: "/realisations/:path*",
        permanent: true
      }
    ]
  }
};
// imagedelivery.net
export default withMDX(nextConfig);
