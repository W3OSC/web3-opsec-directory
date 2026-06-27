"use client";

import { Search } from "lucide-react";

const AVAILABLE_TAGS = [
  "opsec",
  "web2",
  "smart-contracts",
  "infrastructure",
  "devops",
  "training",
  "dns",
  "incident-response",
];

const AVAILABLE_STANDARDS = ["SEAL", "W3OS", "DARC", "SOC2"] as const;

const STANDARD_STYLES: Record<string, { label: string; active: string; inactive: string }> = {
  SEAL: {
    label: "SEAL",
    active: "bg-[rgb(67,57,219)]/20 border-[rgb(67,57,219)] text-[rgb(130,123,255)]",
    inactive: "border-surface-border text-gray-400 hover:border-[rgb(67,57,219)]/50",
  },
  W3OS: {
    label: "W3OS",
    active: "bg-brand/10 border-brand text-brand",
    inactive: "border-surface-border text-gray-400 hover:border-brand/50",
  },
  DARC: {
    label: "DARC",
    active: "bg-[rgb(232,255,106)]/10 border-[rgb(232,255,106)] text-[rgb(232,255,106)]",
    inactive: "border-surface-border text-gray-400 hover:border-[rgb(232,255,106)]/50",
  },
  SOC2: {
    label: "SOC2",
    active: "bg-rose-500/10 border-rose-400 text-rose-400",
    inactive: "border-surface-border text-gray-400 hover:border-rose-400/50",
  },
};

interface Props {
  search: string;
  tags: string[];
  standards?: string[];
  onSearch: (v: string) => void;
  onTagToggle: (tag: string) => void;
  onStandardToggle?: (standard: string) => void;
  showStandards?: boolean;
}

export default function SearchBar({
  search,
  tags,
  standards = [],
  onSearch,
  onTagToggle,
  onStandardToggle,
  showStandards = true,
}: Props) {
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {showStandards && onStandardToggle && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Standards</span>
              {AVAILABLE_STANDARDS.map((std) => {
                const s = STANDARD_STYLES[std];
                const active = standards.includes(std);
                return (
                  <button
                    key={std}
                    onClick={() => onStandardToggle(std)}
                    className={`tag transition-colors ${active ? s.active : s.inactive}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-4 bg-surface-border hidden sm:block" />
          </>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Filter</span>
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
    </div>
  );
}
