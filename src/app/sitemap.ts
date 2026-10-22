import type { MetadataRoute } from "next";
import { cases } from "@/content/proof";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({ url: `${site.url}/uslugi/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["/uslugi", "/kejsy", "/kalkulyator", "/o-kompanii", "/kontakty"].map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cases.map((c) => ({ url: `${site.url}/kejsy/${c.id}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
