import type { NextConfig } from "next";

// EXPORT=1 builds a static preview (no server features are used yet).
const exporting = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(exporting
    ? { output: "export", images: { unoptimized: true } }
    : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
