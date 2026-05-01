import type { MetadataRoute } from "next";
import { locations, site } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/referral-agents", "/gallery", "/contact"];
  const locationRoutes = Object.values(locations).map((location) => location.canonicalPath);

  return [...staticRoutes, ...locationRoutes].map((route) => ({
    url: `${site.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("/locations/") ? 0.9 : 0.8
  }));
}
