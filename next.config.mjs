// import withPlaiceholder from "@plaiceholder/next";

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net", // Legacy support
      },
    ],
    loader: "custom",
    loaderFile: "./lib/imagekit-loader.tsx",
  },
};

export default nextConfig;
