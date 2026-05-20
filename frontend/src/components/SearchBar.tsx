"use client";

import { Search } from "lucide-react";

const AVAILABLE_TAGS = [
  "opsec",
  "web2",
  "web3",
  "infra",
  "seal-certified",
];

interface Props {
  search: string;
  tags: string[];
  onSearch: (v: string) => void;
  onTagToggle: (tag: string) => void;
}

export default function SearchBar({ search, tags, onSearch, onTagToggle }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-surface-raised border border-surface-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand/60 transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`tag transition-colors ${
              tags.includes(tag)
                ? "bg-brand/10 border-brand text-brand"
                : "border-surface-border text-gray-400 hover:border-gray-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
