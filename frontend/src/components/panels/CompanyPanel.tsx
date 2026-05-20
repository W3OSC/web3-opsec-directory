import Link from "next/link";
import { Github, Globe, Twitter, ExternalLink, BadgeCheck } from "lucide-react";
import TagBadge from "@/components/TagBadge";
import type { Company, Tool } from "@/lib/types";

export default function CompanyPanel({
  company,
  tools = [],
}: {
  company: Company;
  tools?: Tool[];
}) {

  return (
    <div className="h-full overflow-y-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {company.logo ? (
          <img
            src={company.logo}
            alt={company.name}
            className="w-14 h-14 rounded-xl object-contain bg-surface-border flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-surface-border flex-shrink-0 flex items-center justify-center text-2xl font-bold text-brand">
            {company.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-white">{company.name}</h2>
            {company.endorsed && (
              <BadgeCheck size={20} className="text-brand flex-shrink-0" />
            )}
          </div>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-1 mt-0.5"
          >
            {company.website.replace(/^https?:\/\//, "")}
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed mb-6">{company.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {company.tags?.map((tag: string) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      {/* Tools */}
      {tools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
            Open Source Tools
          </h3>
          <ul className="space-y-1">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand transition-colors group"
                >
                  <Github size={13} className="flex-shrink-0" />
                  <span className="group-hover:underline">{tool.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-border">
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Globe size={15} /> Visit site
        </a>
        {company.twitter && (
          <a
            href={company.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Twitter size={15} /> Twitter
          </a>
        )}
        {company.github && (
          <a
            href={company.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Github size={15} /> GitHub
          </a>
        )}
        <a
          href={`/company/${company.slug}`}
          className="btn-secondary flex items-center gap-2 text-sm ml-auto"
        >
          Full page <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
