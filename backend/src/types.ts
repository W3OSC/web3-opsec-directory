export interface Company {
  id: number;
  slug: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  services: string;   // JSON array stored as text
  tags: string;       // JSON array stored as text
  badges: string;     // JSON array stored as text
  endorsed: number;   // SQLite boolean (0/1)
  github?: string;
  twitter?: string;
  open_source_repos?: string; // JSON array stored as text
  approved: number;
  created_at: string;
}

export interface Tool {
  id: number;
  slug: string;
  name: string;
  description: string;
  repo_url: string;
  maintainer_slug: string;
  tags: string;
  stars?: number;
  created_at: string;
}

export interface Application {
  id: number;
  company_name: string;
  website: string;
  contact_email: string;
  services: string;
  description: string;
  github_org?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface QuoteRequest {
  id: number;
  company_slug: string;
  name: string;
  email: string;
  project_description: string;
  service_type: string;
  created_at: string;
}
