import { Github, Star, ExternalLink, Building2 } from "lucide-react";
import TagBadge from "@/components/TagBadge";
import type { Tool, Company } from "@/lib/types";

export default function ToolPanel({
  tool,
  onSelectCompany,
}: {
  tool: Tool;
  onSelectCompany?: (slug: string) => void;
}) {
  const maintainer = tool.maintainer as Company | null | undefined;

  return (
    <div className="h-full overflow-y-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-surface-border flex-shrink-0 flex items-center justify-center text-2xl font-bold text-brand">
          {tool.name[0]}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
            {tool.stars != null && (
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Star size={14} className="text-yellow-500" />
                {tool.stars.toLocaleString()}
              </span>
            )}
          </div>
          <a
            href={tool.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-1 mt-0.5"
          >
            {tool.repo_url.replace("https://github.com/", "github.com/")}
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed mb-6">{tool.description}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {tool.tags?.map((tag: string) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      {/* Maintained by */}
      {maintainer && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
            Maintained by
          </h3>
          <button
            onClick={() => onSelectCompany?.(maintainer.slug)}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand/40 transition-colors w-full text-left group"
          >
            {maintainer.logo ? (
              <img
                src={maintainer.logo}
                alt={maintainer.name}
                className="w-8 h-8 rounded-md object-contain bg-surface-border flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-surface-border flex-shrink-0 flex items-center justify-center text-sm font-bold text-brand">
                {maintainer.name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">
                {maintainer.name}
              </p>
              <p className="text-xs text-gray-500">{maintainer.website?.replace(/^https?:\/\//, "")}</p>
            </div>
            <Building2 size={14} className="text-gray-600 ml-auto" />
          </button>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-border">
        <a
          href={tool.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Github size={15} /> View on GitHub
        </a>
        {maintainer && (
          <button
            onClick={() => onSelectCompany?.(maintainer.slug)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Building2 size={15} /> {maintainer.name}
          </button>
        )}
      </div>
    </div>
  );
}
