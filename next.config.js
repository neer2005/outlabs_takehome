/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "np-outlabs-takehome.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;


