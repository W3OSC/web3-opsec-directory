"use client";

import Link from "next/link";
import type { Tool } from "@/lib/types";
import { Github, Star, Sparkles } from "lucide-react";
import TagBadge from "./TagBadge";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`card block transition-colors ${
        tool.pinned
          ? "border-brand/50 hover:border-brand bg-brand/5 col-span-full"
          : "hover:border-brand/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-white">{tool.name}</h3>
          {tool.pinned && (
            <span className="flex items-center gap-1 text-xs text-brand bg-brand/10 border border-brand/30 rounded-full px-2 py-0.5 flex-shrink-0">
              <Sparkles size={10} /> you&apos;re using this
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {tool.stars != null && (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Star size={14} className="text-yellow-500" />
              {tool.stars.toLocaleString()}
            </span>
          )}
          <a
            href={tool.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
