"use client";

import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import ToolCard from "@/components/ToolCard";
import SearchBar from "@/components/SearchBar";
import type { Tool } from "@/lib/types";
import { api } from "@/lib/api";
import { TOOL_CATEGORIES } from "@/lib/toolCategories";

// Categories merged into one proportional row
const MERGED_ROW: [string, string] = ["AI", "Transactions"];
// Category rendered as its own full-width bottom row
const BOTTOM_ROW = "Smart Contract";

const SMART_CONTRACT_SLUGS = [
  "slither",
  "mythril",
  "aderyn",
  "openzeppelin-contracts",
  "echidna",
];

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 300);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.tools.list({ search: debouncedSearch });
      setTools(data);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchTools(); }, [fetchTools]);

  // Group tools by category
  const categorized = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: cat.slugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter((t): t is Tool => t !== undefined),
  })).filter((cat) => cat.tools.length > 0);

  // Smart Contract lives outside TOOL_CATEGORIES as its own bottom row
  const smartContractTools = SMART_CONTRACT_SLUGS
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined);

  // Any tools not assigned to any category or the bottom row
  const categorizedSlugs = new Set([
    ...TOOL_CATEGORIES.flatMap((c) => c.slugs),
    ...SMART_CONTRACT_SLUGS,
  ]);
  const uncategorized = tools.filter((t) => !categorizedSlugs.has(t.slug));

  // Split into normal categories and the merged pair
  const mergedCats = categorized.filter((c) => MERGED_ROW.includes(c.name));
  const normalCats = categorized.filter((c) => !MERGED_ROW.includes(c.name));

  return (
    <div className="pt-10">
      <div className="mb-6 flex items-start justify-between gap-8">
        <div className="flex-shrink-0">
          <h1 className="text-4xl font-bold text-white mb-3">Security Tools</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Open source tools for web3 opsec and infrastructure security,
            maintained by the W3OS ecosystem.
          </p>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <SearchBar
            search={search}
            tags={[]}
            placeholder="Search tools..."
            onSearch={setSearch}
            onTagToggle={() => {}}
            showSearchInput
            showFilters={false}
            showStandards={false}
          />
        </div>
      </div>

      {loading ? null : tools.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No tools found.</p>
      ) : (
        <div className="space-y-5">
          {normalCats.map((cat) => (
            <section key={cat.name}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {cat.tools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          ))}

          {/* AI + Transactions merged row — each label sits above its own group */}
          {mergedCats.length > 0 && (
            <section>
              <div className="flex items-stretch gap-2">
                {mergedCats.map((cat, i) => (
                  <div key={cat.name} className="contents">
                    {i > 0 && <div className="w-px bg-surface-border flex-shrink-0" />}
                    <div className="min-w-0" style={{ flex: cat.tools.length }}>
                      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {cat.name}
                      </h2>
                      <div className="flex gap-2">
                        {cat.tools.map((t) => (
                          <div key={t.slug} className="flex-1 min-w-0">
                            <ToolCard tool={t} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Smart Contract — full-width bottom row */}
          {smartContractTools.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {BOTTOM_ROW}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {smartContractTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}

          {uncategorized.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Other
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {uncategorized.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
