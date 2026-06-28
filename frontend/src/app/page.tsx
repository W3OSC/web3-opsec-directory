"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Company } from "@/lib/types";
import CompanyCard from "@/components/CompanyCard";
import SearchBar from "@/components/SearchBar";
import { useDebounce } from "use-debounce";

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [standards, setStandards] = useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [debouncedSearch] = useDebounce(search, 300);

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await api.companies.list({ search: debouncedSearch, tags, standards });
      setCompanies(data);
    } finally {
      setInitialLoad(false);
    }
  }, [debouncedSearch, tags, standards]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const toggleStandard = (std: string) =>
    setStandards((prev) =>
      prev.includes(std) ? prev.filter((s) => s !== std) : [...prev, std]
    );

  return (
    <div className="pt-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Web3 Security Directory
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Curated list of web3 security firms offering opsec, infrastructure,
          and web2 security services.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          search={search}
          tags={tags}
          standards={standards}
          onSearch={setSearch}
          onTagToggle={toggleTag}
          onStandardToggle={toggleStandard}
        />
      </div>

      {initialLoad ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-44" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No companies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
