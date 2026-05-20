export interface OpenSourceRepo {
  name: string;
  url: string;
  description?: string;
  tool_slug?: string;
}

export interface Company {
  id: number;
  slug: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  services: string[];
  tags: string[];
  endorsed: boolean;
  github?: string;
  twitter?: string;
  openSourceRepos?: OpenSourceRepo[];
  approved: boolean;
  createdAt: string;
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  repo_url: string;
  maintainer_slug: string;
  tags: string[];
  stars?: number | null;
  pinned?: boolean;
  maintainer?: Company | null;
}

export interface Application {
  id: number;
  companyName: string;
  website: string;
  contactEmail: string;
  services: string[];
  description: string;
  githubOrg?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface QuoteRequest {
  id: number;
  companySlug: string;
  name: string;
  email: string;
  projectDescription: string;
  serviceType: string;
  createdAt: string;
}
