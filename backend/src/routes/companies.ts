import { Hono } from "hono";
import { db } from "../db";
import type { Company } from "../types";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const companies = new Hono();
const IS_DEV = process.env.NODE_ENV !== "production";
const DATA_DIR = join(import.meta.dir, "../../../data/companies");

// In dev: read JSON files directly so edits are live without restart.
// In prod: read from DB (seeded from git on deploy).

type CompanyJson = {
  slug: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  services: string[];
  tags: string[];
  endorsed?: boolean;
  github?: string | null;
  twitter?: string | null;
  open_source_repos?: { name: string; url: string; description?: string }[];
};

async function fromFiles(): Promise<CompanyJson[]> {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));
  const results = await Promise.all(
    files.map((f) => readFile(join(DATA_DIR, f), "utf-8").then(JSON.parse))
  );
  return results;
}

function normalizeJson(c: CompanyJson) {
  return {
    ...c,
    logo: c.logo ?? "",
    endorsed: c.endorsed ?? false,
    github: c.github ?? null,
    twitter: c.twitter ?? null,
    openSourceRepos: c.open_source_repos ?? [],
    open_source_repos: undefined,
  };
}

function serializeRow(row: Company) {
  const { open_source_repos, services, tags, endorsed, ...rest } = row;
  return {
    ...rest,
    services: JSON.parse(services ?? "[]"),
    tags: JSON.parse(tags ?? "[]"),
    openSourceRepos: JSON.parse(open_source_repos ?? "[]"),
    endorsed: endorsed === 1,
  };
}

companies.get("/", async (c) => {
  const search = (c.req.query("search") ?? "").toLowerCase();
  const tagsParam = c.req.query("tags") ?? "";
  const filterTags = tagsParam ? tagsParam.split(",") : [];

  if (IS_DEV) {
    let all = await fromFiles();
    if (search) {
      all = all.filter(
        (co) =>
          co.name.toLowerCase().includes(search) ||
          co.description.toLowerCase().includes(search)
      );
    }
    if (filterTags.length) {
      all = all.filter((co) =>
        filterTags.every((t) => co.tags.includes(t))
      );
    }
    return c.json(all.map(normalizeJson));
  }

  let query = "SELECT * FROM companies WHERE approved = 1";
  const params: string[] = [];
  if (search) {
    query += " AND (name LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  const rows = db.query(query).all(...params) as Company[];
  const filtered = filterTags.length
    ? rows.filter((r) =>
        filterTags.every((tag) => JSON.parse(r.tags ?? "[]").includes(tag))
      )
    : rows;
  return c.json(filtered.map(serializeRow));
});

companies.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!/^[a-z0-9-]+$/.test(slug)) return c.json({ error: "Not found" }, 404);

  if (IS_DEV) {
    let data: CompanyJson;
    try {
      data = JSON.parse(
        await readFile(join(DATA_DIR, `${slug}.json`), "utf-8")
      );
    } catch {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(normalizeJson(data));
  }

  const row = db
    .query("SELECT * FROM companies WHERE slug = ? AND approved = 1")
    .get(slug) as Company | null;
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(serializeRow(row));
});

export default companies;
