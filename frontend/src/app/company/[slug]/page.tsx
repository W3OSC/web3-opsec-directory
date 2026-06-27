import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Github, Twitter, ExternalLink, Star, Sparkles } from "lucide-react";
import TagBadge from "@/components/TagBadge";
import ShareButton from "@/components/ShareButton";
import type { Tool } from "@/lib/types";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const STANDARD_DETAIL_STYLES: Record<string, string> = {
  SEAL: "bg-[rgb(67,57,219)]/15 border-[rgb(67,57,219)] text-[rgb(130,123,255)]",
  W3OS: "bg-brand/10 border-brand text-brand",
  DARC: "bg-[rgb(232,255,106)]/10 border-[rgb(232,255,106)] text-[rgb(232,255,106)]",
  SOC2: "bg-rose-500/10 border-rose-400 text-rose-400",
};

async function getCompany(slug: string) {
  const res = await fetch(`${API_URL}/api/companies/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getCompanyTools(slug: string): Promise<Tool[]> {
  const res = await fetch(`${API_URL}/api/tools?maintainer=${slug}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://w3os.org";

  return {
    title: company.name,
    description: company.description,
    openGraph: {
      title: `${company.name} | W3OS`,
      description: company.description,
      url: `${siteUrl}/company/${slug}`,
      images: [
        {
          url: `${API_URL}/api/og/${slug}`,
          width: 1200,
          height: 630,
          alt: company.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} | W3OS Security Directory`,
      description: company.description,
      images: [`${API_URL}/api/og/${slug}`],
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [company, tools] = await Promise.all([getCompany(slug), getCompanyTools(slug)]);
  if (!company) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://w3os.org";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.website,
    ...(company.logo && { logo: company.logo }),
    ...(company.twitter && { sameAs: [company.twitter] }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl py-10">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                loading="lazy"
                className="w-16 h-16 rounded-xl object-contain bg-surface-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-surface-border flex items-center justify-center text-2xl font-bold text-brand">
                {company.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                {company.endorsed && (
                  <BadgeCheck size={24} className="text-brand" />
                )}
              </div>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand transition-colors flex items-center gap-1 mt-1"
              >
                {company.website}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            {company.github && (
              <a href={company.github} target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2">
                <Github size={16} /> GitHub
              </a>
            )}
            {company.twitter && (
              <a href={company.twitter} target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2">
                <Twitter size={16} /> Twitter
              </a>
            )}
          </div>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          {company.description}
        </p>

        {company.standards?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(["SEAL", "W3OS", "DARC", "SOC2"] as const)
              .filter((s: string) => company.standards.includes(s))
              .map((std: string) => (
                <span
                  key={std}
                  className={`text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded border border-l-2 ${STANDARD_DETAIL_STYLES[std] ?? "bg-gray-500/10 border-gray-500 text-gray-400"}`}
                >
                  {std}
                </span>
              ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-10">
          {company.tags.map((tag: string) => (
            <TagBadge key={tag} tag={tag} compact={false} />
          ))}
        </div>

        {tools.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Open Source Tools</h2>
            <div className="space-y-3">
              {tools.map((tool: Tool) => (
                <a
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-colors group ${
                    tool.pinned
                      ? "bg-brand/5 border-brand/40 hover:border-brand"
                      : "bg-surface-raised border-surface-border hover:border-brand/40"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-white group-hover:text-brand transition-colors">
                        {tool.name}
                      </span>
                      {tool.pinned && (
                        <span className="flex items-center gap-1 text-xs text-brand bg-brand/10 border border-brand/30 rounded-full px-2 py-0.5">
                          <Sparkles size={10} /> you&apos;re using this
                        </span>
                      )}
                      {tool.stars != null && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={11} className="text-yellow-500" />
                          {tool.stars}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tool.tags?.map((tag: string) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                  <Github size={16} className="text-gray-500 group-hover:text-brand transition-colors flex-shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-surface-border pt-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to directory
          </Link>
          <ShareButton name={company.name} url={`${siteUrl}/company/${slug}`} />
        </div>
      </div>
    </>
  );
}
