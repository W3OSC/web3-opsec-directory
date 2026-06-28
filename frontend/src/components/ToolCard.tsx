"use client";

import Link from "next/link";
import type { Tool } from "@/lib/types";
import { Github, Star, Sparkles } from "lucide-react";
import TagBadge from "./TagBadge";

export default function ToolCard({ tool }: { tool: Tool }) {
  const visibleTags = tool.tags.slice(0, 3);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`flex flex-col h-60 rounded-xl border p-3 transition-colors ${
        tool.pinned
          ? "border-brand/50 hover:border-brand bg-brand/5"
          : "bg-surface-raised border-surface-border hover:border-brand/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight">{tool.name}</h3>
          {tool.pinned && (
            <span className="flex items-center text-brand bg-brand/10 border border-brand/30 rounded-full p-0.5 flex-shrink-0 mt-0.5">
              <Sparkles size={8} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {tool.stars != null && (
            <span className="flex items-center gap-0.5 text-xs text-gray-500">
              <Star size={11} className="text-yellow-500" />
              {tool.stars.toLocaleString()}
            </span>
          )}
          <a
            href={tool.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Github size={14} />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="mt-1.5 text-xs text-gray-400 leading-relaxed overflow-hidden">
        {tool.description}
      </p>

      {/* Tags — pinned to bottom */}
      {visibleTags.length > 0 && (
        <div className="mt-auto pt-2 flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  );
}
