import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap:
      "https://fixmycampus-rohanv2007s-projects.vercel.app/sitemap.xml",
  };
}
