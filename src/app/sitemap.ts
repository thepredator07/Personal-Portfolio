import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/content";
import { getAllNotes } from "@/lib/notes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/notes/`, changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getAllNotes().map((n) => ({ url: `${base}/notes/${n.slug}/`, lastModified: n.date, priority: 0.6 })),
  ];
}
