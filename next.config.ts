import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep vendor binaries out of the bundle while still tracing them for the IPTC API route.
  serverExternalPackages: ["node-exiftool", "dist-exiftool"],
  outputFileTracingIncludes: {
    "/src/app/api/iptc/write/route": [
      "./node_modules/dist-exiftool/**/*",
      "./node_modules/dist-exiftool/node_modules/exiftool.pl/vendor/**/*",
      "./node_modules/exiftool.pl/vendor/**/*",
      "./node_modules/exiftool.exe/vendor/**/*",
    ],
    "/app/api/iptc/write/route": [
      "./node_modules/dist-exiftool/**/*",
      "./node_modules/dist-exiftool/node_modules/exiftool.pl/vendor/**/*",
      "./node_modules/exiftool.pl/vendor/**/*",
      "./node_modules/exiftool.exe/vendor/**/*",
    ],
  },
};

export default nextConfig;
