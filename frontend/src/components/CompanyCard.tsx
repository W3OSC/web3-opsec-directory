import type { Company } from "@/lib/types";
import Link from "next/link";
import TagBadge from "./TagBadge";
import { BadgeCheck, Github, Globe, Twitter, ArrowRight } from "lucide-react";

// Standards display order and styling
const STANDARDS_ORDER = ["SEAL", "W3OS", "DARC", "SOC2"] as const;

const STANDARD_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  SEAL: {
    bg: "bg-[rgb(67,57,219)]/15",
    border: "border-l-[rgb(67,57,219)]",
    text: "text-[rgb(130,123,255)]",
  },
  W3OS: {
    bg: "bg-brand/10",
    border: "border-l-brand",
    text: "text-brand",
  },
  DARC: {
    bg: "bg-[rgb(232,255,106)]/10",
    border: "border-l-[rgb(232,255,106)]",
    text: "text-[rgb(232,255,106)]",
  },
  SOC2: {
    bg: "bg-rose-500/10",
    border: "border-l-rose-400",
    text: "text-rose-400",
  },
};

function StandardBadge({ standard }: { standard: string }) {
  const s = STANDARD_STYLES[standard] ?? {
    bg: "bg-gray-500/10",
    border: "border-l-gray-500",
    text: "text-gray-400",
  };
  return (
    <div
      className={`${s.bg} ${s.border} ${s.text} border border-surface-border border-l-2 rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase`}
    >
      {standard}
    </div>
  );
}

export default function CompanyCard({ company }: { company: Company }) {
  const orderedStandards = STANDARDS_ORDER.filter((s) =>
    company.standards?.includes(s)
  );

  return (
    <div className="card flex flex-col gap-3">
      {/* Header row: logo + name/url + social icons */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              loading="lazy"
              className="w-10 h-10 rounded-lg object-contain bg-surface-border flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-surface-border flex-shrink-0 flex items-center justify-center text-lg font-bold text-brand">
              {company.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">
                {company.name}
              </h3>
              {company.endorsed && (
                <BadgeCheck size={16} className="text-brand flex-shrink-0" />
              )}
            </div>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-500 hover:text-brand transition-colors truncate block"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {company.github && (
            <a
              href={company.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={15} />
            </a>
          )}
          {company.twitter && (
            <a
              href={company.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Twitter size={15} />
            </a>
          )}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe size={15} />
          </a>
        </div>
      </div>

      {/* Body: description (left) + right column (standards + tags) */}
      <div className="flex gap-4 flex-1">
        {/* Description */}
        <p className="flex-1 text-sm text-gray-400 line-clamp-4 leading-relaxed">
          {company.description}
        </p>

        {/* Right column: standards then tags stacked vertically */}
        <div className="flex flex-col gap-1.5 flex-shrink-0 items-end min-w-[68px]">
          {orderedStandards.map((std) => (
            <StandardBadge key={std} standard={std} />
          ))}

          {orderedStandards.length > 0 && company.tags.length > 0 && (
            <div className="w-full border-t border-surface-border my-0.5" />
          )}

          {company.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Footer: view profile button */}
      <div className="pt-2 border-t border-surface-border flex justify-end">
        <Link
          href={`/company/${company.slug}`}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand transition-colors group"
        >
          View profile
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
