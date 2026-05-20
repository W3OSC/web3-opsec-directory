import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://w3os.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await fetch(`${API_URL}/api/companies`)
    .then((r) => r.json())
    .catch(() => []);

  const companyRoutes = companies.map((c: { slug: string; createdAt: string }) => ({
    url: `${SITE_URL}/company/${c.slug}`,
    lastModified: new Date(c.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/apply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...companyRoutes,
  ];
}
