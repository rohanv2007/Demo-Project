import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FixMyCampus — See it. Report it. Get it fixed.",
    short_name: "FixMyCampus",
    description:
      "A public fix-list for campus. Report what's broken, rally upvotes, and watch it get fixed.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e5",
    theme_color: "#f6f1e5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
