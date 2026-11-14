import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/destinations/ambosseli-national-park",
        destination: "/destinations/amboseli-national-park",
        permanent: true,
      },
      {
        source: "/services/airticketing",
        destination: "/services/flights",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/company#about",
        permanent: true,
      },
      {
        source: "/calling",
        destination: "/company#calling",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/company#impact",
        permanent: true,
      },
      {
        source: "/faqs",
        destination: "/company#faqs",
        permanent: true,
      },
      {
        source: "/testimonials",
        destination: "/company#testimonials",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
