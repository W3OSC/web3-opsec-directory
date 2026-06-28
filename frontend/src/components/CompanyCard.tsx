import type { Company } from "@/lib/types";
import Link from "next/link";
import TagBadge from "./TagBadge";
import { BadgeCheck, Github, Globe, Twitter, ArrowRight } from "lucide-react";
import { STANDARDS_ORDER, getStandardMeta } from "@/lib/standards";

function StandardBadge({ standard }: { standard: string }) {
  const s = getStandardMeta(standard);
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`${s.bg} ${s.borderLeft} ${s.text} border border-r-0 border-surface-border border-l-2 rounded-l-sm py-0.5 text-[10px] font-bold tracking-wider uppercase text-center w-12 block hover:brightness-125 transition-[filter]`}
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
    <Link
      href={`/company/${company.slug}`}
      className="card flex flex-col justify-between gap-3 cursor-pointer hover:border-brand/40 transition-colors"
    >
      {/* Top content — block container so floats work correctly */}
      <div className="flex-1 after:content-[''] after:block after:clear-both">
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
        <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-brand transition-colors">
          View profile
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
