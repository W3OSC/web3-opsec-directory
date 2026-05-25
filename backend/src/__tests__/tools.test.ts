import { describe, it, expect } from "bun:test";
import { createTestApp } from "./helpers";

const app = createTestApp();

describe("GET /api/tools", () => {
  it("returns an array of tools", async () => {
    const res = await app.request("/api/tools");
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("each tool has required fields", async () => {
    const res = await app.request("/api/tools");
    const data = await res.json() as Record<string, unknown>[];
    for (const tool of data) {
      expect(typeof tool.slug).toBe("string");
      expect(typeof tool.name).toBe("string");
      expect(typeof tool.description).toBe("string");
      expect(typeof tool.repo_url).toBe("string");
      expect(typeof tool.maintainer_slug).toBe("string");
      expect(Array.isArray(tool.tags)).toBe(true);
    }
  });

  it("each tool has a valid repo_url", async () => {
    const res = await app.request("/api/tools");
    const data = await res.json() as Record<string, unknown>[];
    for (const tool of data) {
      const url = new URL(tool.repo_url as string);
      expect(["http:", "https:"]).toContain(url.protocol);
    }
  });

  it("every tool maintainer_slug resolves to a real company", async () => {
    const res = await app.request("/api/tools");
    const data = await res.json() as Record<string, unknown>[];
    for (const tool of data) {
      expect(tool.maintainer).not.toBeNull();
      const maintainer = tool.maintainer as Record<string, unknown>;
      expect(maintainer.slug).toBe(tool.maintainer_slug);
    }
  });

  it("includes maintainer data", async () => {
    const res = await app.request("/api/tools");
    const data = await res.json() as Record<string, unknown>[];
    const withMaintainer = data.filter((t) => t.maintainer !== null);
    expect(withMaintainer.length).toBeGreaterThan(0);
    const maintainer = withMaintainer[0].maintainer as Record<string, unknown>;
    expect(typeof maintainer.slug).toBe("string");
    expect(typeof maintainer.name).toBe("string");
  });

  it("filters by search term", async () => {
    const res = await app.request("/api/tools?search=conduit");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>[];
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((t) => {
      const name = (t.name as string).toLowerCase();
      const desc = (t.description as string).toLowerCase();
      return name.includes("conduit") || desc.includes("conduit");
    })).toBe(true);
  });

  it("returns empty array for unmatched search", async () => {
    const res = await app.request("/api/tools?search=zzznomatchzzz");
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toEqual([]);
  });

  it("filters by maintainer", async () => {
    const res = await app.request("/api/tools?maintainer=auditware");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>[];
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((t) => t.maintainer_slug === "auditware")).toBe(true);
  });
});

describe("GET /api/tools/:slug", () => {
  it("returns a known tool", async () => {
    const res = await app.request("/api/tools/conduit");
    expect(res.status).toBe(200);
    const data = await res.json() as Record<string, unknown>;
    expect(data.slug).toBe("conduit");
    expect(typeof data.name).toBe("string");
  });

  it("returns 404 for unknown slug", async () => {
    const res = await app.request("/api/tools/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 404 for invalid slug characters", async () => {
    const res = await app.request("/api/tools/bad slug!");
    expect(res.status).toBe(404);
  });
});
