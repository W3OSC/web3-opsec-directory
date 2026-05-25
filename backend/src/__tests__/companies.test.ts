import { describe, it, expect } from "bun:test";
import { createTestApp } from "./helpers";

const app = createTestApp();

describe("GET /api/companies", () => {
  it("returns an array of companies", async () => {
    const res = await app.request("/api/companies");
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("each company has required fields", async () => {
    const res = await app.request("/api/companies");
    const data = await res.json() as Record<string, unknown>[];
    for (const company of data) {
      expect(typeof company.slug).toBe("string");
      expect(typeof company.name).toBe("string");
      expect(typeof company.description).toBe("string");
      expect(typeof company.website).toBe("string");
      expect(Array.isArray(company.tags)).toBe(true);
      expect(Array.isArray(company.services)).toBe(true);
    }
  });

  it("each company has a valid website URL", async () => {
    const res = await app.request("/api/companies");
    const data = await res.json() as Record<string, unknown>[];
    for (const company of data) {
      const url = new URL(company.website as string);
      expect(["http:", "https:"]).toContain(url.protocol);
    }
  });

  it("endorsed field is a boolean", async () => {
    const res = await app.request("/api/companies");
    const data = await res.json() as Record<string, unknown>[];
    for (const company of data) {
      expect(typeof company.endorsed).toBe("boolean");
    }
  });

  it("openSourceRepos entries have name and url", async () => {
    const res = await app.request("/api/companies");
    const data = await res.json() as Record<string, unknown>[];
    for (const company of data) {
      const repos = company.openSourceRepos as Record<string, unknown>[];
      expect(Array.isArray(repos)).toBe(true);
      for (const repo of repos) {
        expect(typeof repo.name).toBe("string");
        expect(typeof repo.url).toBe("string");
        expect(() => new URL(repo.url as string)).not.toThrow();
      }
    }
  });

  it("filters by multiple tags (AND logic)", async () => {
    const res = await app.request("/api/companies?tags=opsec,web3");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>[];
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((c) => {
      const tags = c.tags as string[];
      return tags.includes("opsec") && tags.includes("web3");
    })).toBe(true);
  });

  it("filters by search term", async () => {
    const res = await app.request("/api/companies?search=auditware");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>[];
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((c) => {
      const name = (c.name as string).toLowerCase();
      const desc = (c.description as string).toLowerCase();
      return name.includes("auditware") || desc.includes("auditware");
    })).toBe(true);
  });

  it("returns empty array for unmatched search", async () => {
    const res = await app.request("/api/companies?search=zzznomatchzzz");
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toEqual([]);
  });

  it("filters by tag", async () => {
    const res = await app.request("/api/companies?tags=opsec");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>[];
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((c) => (c.tags as string[]).includes("opsec"))).toBe(true);
  });
});

describe("GET /api/companies/:slug", () => {
  it("returns a known company", async () => {
    const res = await app.request("/api/companies/auditware");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>;
    expect(data.slug).toBe("auditware");
    expect(typeof data.name).toBe("string");
  });

  it("returns 404 for unknown slug", async () => {
    const res = await app.request("/api/companies/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 404 for invalid slug characters", async () => {
    const res = await app.request("/api/companies/bad slug!");
    expect(res.status).toBe(404);
  });
});
