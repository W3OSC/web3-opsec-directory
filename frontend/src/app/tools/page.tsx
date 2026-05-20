"use client";

import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import ToolCard from "@/components/ToolCard";
import SearchBar from "@/components/SearchBar";
import type { Tool } from "@/lib/types";
import { api } from "@/lib/api";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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

  const toggleTag = (tag: string) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const filtered = (tags.length
    ? tools.filter((t) => tags.every((tag) => t.tags?.includes(tag)))
    : tools
  ).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="pt-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Security Tools</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Open source tools for web3 opsec and infrastructure security,
          maintained by the W3OS ecosystem.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          search={search}
          tags={tags}
          onSearch={setSearch}
          onTagToggle={toggleTag}
        />
      </div>

      {loading ? null : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No tools found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}
