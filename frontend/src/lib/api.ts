import type { Company, Tool } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  companies: {
    list: (params?: { search?: string; tags?: string[] }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.tags?.length) qs.set("tags", params.tags.join(","));
      return apiFetch<Company[]>(`/api/companies?${qs}`);
    },
    get: (slug: string) => apiFetch<Company>(`/api/companies/${slug}`),
  },
  tools: {
    list: (params?: { search?: string; maintainer?: string }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.maintainer) qs.set("maintainer", params.maintainer);
      return apiFetch<Tool[]>(`/api/tools?${qs}`);
    },
    get: (slug: string) => apiFetch<Tool>(`/api/tools/${slug}`),
  },
  apply: (data: {
    companyName: string;
    website: string;
    contactEmail: string;
    services: string[];
    description: string;
    githubOrg?: string;
  }) =>
    apiFetch("/api/apply", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  quote: (data: {
    companySlug: string;
    name: string;
    email: string;
    projectDescription: string;
    serviceType: string;
  }) =>
    apiFetch("/api/quote", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
