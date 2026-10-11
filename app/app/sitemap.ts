import type { MetadataRoute } from "next";

const BASE = "https://fixmycampus-rohanv2007s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/issues`, lastModified: new Date() },
    { url: `${BASE}/map`, lastModified: new Date() },
    { url: `${BASE}/report`, lastModified: new Date() },
  ];
}
