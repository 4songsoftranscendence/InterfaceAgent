import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude CLI-only modules from the client bundle
  serverExternalPackages: ["playwright", "sharp"],
};

export default nextConfig;
