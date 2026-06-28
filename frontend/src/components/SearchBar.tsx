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
] as const;

// Matches TagBadge TAG_STYLES — active uses full color, inactive is dimmed
const TAG_STYLES: Record<string, { active: string; inactive: string }> = {
  opsec:               { active: "bg-orange-500/10 border-orange-500/40 text-orange-400",   inactive: "bg-transparent border-surface-border text-gray-500 hover:border-orange-500/30 hover:text-orange-400/60" },
  web2:                { active: "bg-gray-500/10 border-gray-500/40 text-gray-300",          inactive: "bg-transparent border-surface-border text-gray-500 hover:border-gray-500/30 hover:text-gray-300/60" },
  "smart-contracts":   { active: "bg-violet-500/10 border-violet-500/40 text-violet-400",   inactive: "bg-transparent border-surface-border text-gray-500 hover:border-violet-500/30 hover:text-violet-400/60" },
  infrastructure:      { active: "bg-yellow-500/10 border-yellow-500/40 text-yellow-400",   inactive: "bg-transparent border-surface-border text-gray-500 hover:border-yellow-500/30 hover:text-yellow-400/60" },
  devops:              { active: "bg-sky-500/10 border-sky-500/40 text-sky-400",             inactive: "bg-transparent border-surface-border text-gray-500 hover:border-sky-500/30 hover:text-sky-400/60" },
  training:            { active: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",inactive: "bg-transparent border-surface-border text-gray-500 hover:border-emerald-500/30 hover:text-emerald-400/60" },
  dns:                 { active: "bg-pink-500/10 border-pink-500/40 text-pink-400",          inactive: "bg-transparent border-surface-border text-gray-500 hover:border-pink-500/30 hover:text-pink-400/60" },
  "incident-response": { active: "bg-red-500/10 border-red-500/40 text-red-400",            inactive: "bg-transparent border-surface-border text-gray-500 hover:border-red-500/30 hover:text-red-400/60" },
};

const AVAILABLE_STANDARDS = ["SEAL", "W3OS", "DARC", "SOC2"] as const;

const STANDARD_STYLES: Record<string, { active: string; inactive: string }> = {
  SEAL: {
    active:   "bg-[rgb(67,57,219)]/15 border-[rgb(67,57,219)] text-[rgb(130,123,255)]",
    inactive: "bg-transparent border-surface-border text-gray-500 hover:border-[rgb(67,57,219)]/40 hover:text-[rgb(130,123,255)]/60",
  },
  W3OS: {
    active:   "bg-brand/10 border-brand text-brand",
    inactive: "bg-transparent border-surface-border text-gray-500 hover:border-brand/40 hover:text-brand/60",
  },
  DARC: {
    active:   "bg-[rgb(232,255,106)]/10 border-[rgb(232,255,106)] text-[rgb(232,255,106)]",
    inactive: "bg-transparent border-surface-border text-gray-500 hover:border-[rgb(232,255,106)]/40 hover:text-[rgb(232,255,106)]/60",
  },
  SOC2: {
    active:   "bg-rose-500/10 border-rose-400 text-rose-400",
    inactive: "bg-transparent border-surface-border text-gray-500 hover:border-rose-400/40 hover:text-rose-400/60",
  },
};

// Shared compact chip style matching TagBadge compact mode
const CHIP = "border rounded-sm px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer";

interface Props {
  search: string;
  tags: string[];
  standards?: string[];
  onSearch: (v: string) => void;
  onTagToggle: (tag: string) => void;
  onStandardToggle?: (standard: string) => void;
  showStandards?: boolean;
  showSearchInput?: boolean;
  showFilters?: boolean;
}

export default function SearchBar({
  search,
  tags,
  standards = [],
  onSearch,
  onTagToggle,
  onStandardToggle,
  showStandards = true,
  showSearchInput = true,
  showFilters = true,
}: Props) {
  return (
    <div className="space-y-3">
      {showSearchInput && (
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
      )}

      {showFilters && <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                    className={`${CHIP} ${active ? s.active : s.inactive}`}
                  >
                    {std}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-4 bg-surface-border hidden sm:block" />
          </>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Specialization</span>
          {AVAILABLE_TAGS.map((tag) => {
            const s = TAG_STYLES[tag];
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`${CHIP} ${active ? s.active : s.inactive}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>}
    </div>
  );
}
