import type { Company } from "@/lib/types";
import Link from "next/link";
import TagBadge from "./TagBadge";
import { BadgeCheck, Github, Globe, Twitter, ArrowRight } from "lucide-react";

// Standards display order and styling
const STANDARDS_ORDER = ["SEAL", "W3OS", "DARC", "SOC2"] as const;

const STANDARD_META: Record<string, { bg: string; text: string; border: string; href: string }> = {
  SEAL: {
    bg: "bg-[rgb(67,57,219)]/15",
    border: "border-l-[rgb(67,57,219)]",
    text: "text-[rgb(130,123,255)]",
    href: "https://frameworks.securityalliance.org/certs/overview/",
  },
  W3OS: {
    bg: "bg-brand/10",
    border: "border-l-brand",
    text: "text-brand",
    href: "https://github.com/W3OSC/web3-opsec-standard",
  },
  DARC: {
    bg: "bg-[rgb(232,255,106)]/10",
    border: "border-l-[rgb(232,255,106)]",
    text: "text-[rgb(232,255,106)]",
    href: "https://darcstandard.org",
  },
  SOC2: {
    bg: "bg-rose-500/10",
    border: "border-l-rose-400",
    text: "text-rose-400",
    href: "https://www.vanta.com/collection/soc-2/what-is-soc-2",
  },
};

function StandardBadge({ standard }: { standard: string }) {
  const s = STANDARD_META[standard] ?? {
    bg: "bg-gray-500/10",
    border: "border-l-gray-500",
    text: "text-gray-400",
    href: "#",
  };
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`${s.bg} ${s.border} ${s.text} border border-r-0 border-surface-border border-l-2 rounded-l-sm py-0.5 text-[10px] font-bold tracking-wider uppercase text-center w-12 block hover:brightness-125 transition-[filter]`}
    >
      {standard}
    </a>
  );
}

export default function CompanyCard({ company }: { company: Company }) {
  const orderedStandards = STANDARDS_ORDER.filter((s) =>
    company.standards?.includes(s)
  );

  return (
    <div className="card flex flex-col justify-between gap-3">
      {/* Top content — block container so floats work correctly */}
      <div className="flex-1 overflow-hidden">
        {/* Float standards top-right — flush with card edge */}
        {orderedStandards.length > 0 && (
          <div className="float-right -mr-6 ml-3 flex flex-col gap-1.5 items-end">
            {orderedStandards.map((std) => (
              <StandardBadge key={std} standard={std} />
            ))}
          </div>
        )}

        {/* Header: logo + name/url */}
        <div className="flex items-center gap-3 min-w-0 mb-3">
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

        {/* Description wraps around the float */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {company.description}
        </p>
      </div>

      {/* Tags — separate flex item, hugs the footer divider */}
      {company.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {company.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Footer: social icons (left) + view profile (right) */}
      <div className="pt-2 border-t border-surface-border flex items-center justify-between">
        <div className="flex gap-3">
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
