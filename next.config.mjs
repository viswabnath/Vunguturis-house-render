/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // robots.txt only asks politely; this header also covers the PDFs, images and 3D models.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" }],
      },
    ];
  },
};

export default nextConfig;
