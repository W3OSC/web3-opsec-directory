import type { Company } from "@/lib/types";
import Link from "next/link";
import TagBadge from "./TagBadge";
import { BadgeCheck, Github, Globe, Twitter } from "lucide-react";

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/company/${company.slug}`} className="card block group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-10 h-10 rounded-lg object-contain bg-surface-border flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-surface-border flex-shrink-0 flex items-center justify-center text-lg font-bold text-brand">
              {company.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white group-hover:text-brand transition-colors truncate">
                {company.name}
              </h3>
              {company.endorsed && (
                <BadgeCheck size={16} className="text-brand flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">{company.website}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {company.github && (
            <a
              href={company.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Github size={16} />
            </a>
          )}
          {company.twitter && (
            <a
              href={company.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Twitter size={16} />
            </a>
          )}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Globe size={16} />
          </a>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-400 line-clamp-2">
        {company.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {company.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
