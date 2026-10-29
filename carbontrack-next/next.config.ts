import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable Tailwind CSS loader - we use original styles.css from public/ */
  turbopack: {
    root: __dirname, // fixes multiple-lockfiles warning
  },
};

export default nextConfig;
