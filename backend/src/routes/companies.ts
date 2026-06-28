import { Hono } from "hono";
import { db } from "../db";
import type { Company } from "../types";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const companies = new Hono();
const IS_DEV = process.env.NODE_ENV !== "production";
const DATA_DIR = join(import.meta.dir, "../../../data/companies");
const TOOLS_DIR = join(import.meta.dir, "../../../data/tools");

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
  badges?: string[];
  standards?: string[];
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

// Build a map of maintainer_slug -> total stars from tool JSON files (dev) or DB (prod).
async function buildStarsMap(): Promise<Record<string, number>> {
  const map: Record<string, number> = {};
  if (IS_DEV) {
    const files = (await readdir(TOOLS_DIR)).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      const t = JSON.parse(await readFile(join(TOOLS_DIR, f), "utf-8"));
      if (t.maintainer_slug && typeof t.stars === "number") {
        map[t.maintainer_slug] = (map[t.maintainer_slug] ?? 0) + t.stars;
      }
    }
  } else {
    const rows = db.query("SELECT maintainer_slug, stars FROM tools WHERE stars IS NOT NULL").all() as { maintainer_slug: string; stars: number }[];
    for (const r of rows) {
      map[r.maintainer_slug] = (map[r.maintainer_slug] ?? 0) + r.stars;
    }
  }
  return map;
}

// Sort: endorsed > # standards > # tags > total stars > alphabetical
function sortCompanies<T extends { slug: string; name: string; endorsed: boolean | number; tags: string[] | string; standards: string[] | string }>(
  list: T[],
  starsMap: Record<string, number>
): T[] {
  return [...list].sort((a, b) => {
    // 1. Endorsed
    const aEndorsed = a.endorsed === true || a.endorsed === 1 ? 1 : 0;
    const bEndorsed = b.endorsed === true || b.endorsed === 1 ? 1 : 0;
    if (aEndorsed !== bEndorsed) return bEndorsed - aEndorsed;

    // 2. Number of standards
    const aStandards = Array.isArray(a.standards) ? a.standards : JSON.parse((a.standards as string) ?? "[]");
    const bStandards = Array.isArray(b.standards) ? b.standards : JSON.parse((b.standards as string) ?? "[]");
    if (aStandards.length !== bStandards.length) return bStandards.length - aStandards.length;

    // 3. Number of tags (specializations)
    const aTags = Array.isArray(a.tags) ? a.tags : JSON.parse((a.tags as string) ?? "[]");
    const bTags = Array.isArray(b.tags) ? b.tags : JSON.parse((b.tags as string) ?? "[]");
    if (aTags.length !== bTags.length) return bTags.length - aTags.length;

    // 4. Total tool stars
    const starsDiff = (starsMap[b.slug] ?? 0) - (starsMap[a.slug] ?? 0);
    if (starsDiff !== 0) return starsDiff;

    // 5. Alphabetical
    return a.name.localeCompare(b.name);
  });
}

function normalizeJson(c: CompanyJson) {
  return {
    ...c,
    logo: c.logo ?? "",
    endorsed: c.endorsed ?? false,
    github: c.github ?? null,
    twitter: c.twitter ?? null,
    badges: c.badges ?? [],
    standards: c.standards ?? [],
    openSourceRepos: c.open_source_repos ?? [],
    open_source_repos: undefined,
  };
}

function serializeRow(row: Company) {
  const { open_source_repos, services, tags, badges, standards, endorsed, ...rest } = row;
  return {
    ...rest,
    services: JSON.parse(services ?? "[]"),
    tags: JSON.parse(tags ?? "[]"),
    badges: JSON.parse(badges ?? "[]"),
    standards: JSON.parse(standards ?? "[]"),
    openSourceRepos: JSON.parse(open_source_repos ?? "[]"),
    endorsed: endorsed === 1,
  };
}

companies.get("/", async (c) => {
  const search = (c.req.query("search") ?? "").toLowerCase();
  const tagsParam = c.req.query("tags") ?? "";
  const filterTags = tagsParam ? tagsParam.split(",") : [];
  const standardsParam = c.req.query("standards") ?? "";
  const filterStandards = standardsParam ? standardsParam.split(",") : [];
  const starsMap = await buildStarsMap();

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
    if (filterStandards.length) {
      all = all.filter((co) =>
        filterStandards.every((s) => (co.standards ?? []).includes(s))
      );
    }
    const normalized = all.map(normalizeJson);
    return c.json(sortCompanies(normalized, starsMap));
  }

  let query = "SELECT * FROM companies WHERE approved = 1";
  const params: string[] = [];
  if (search) {
    query += " AND (name LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  const rows = db.query(query).all(...params) as Company[];
  const filtered = rows.filter((r) => {
    if (filterTags.length && !filterTags.every((tag) => JSON.parse(r.tags ?? "[]").includes(tag))) return false;
    if (filterStandards.length && !filterStandards.every((s) => JSON.parse(r.standards ?? "[]").includes(s))) return false;
    return true;
  });
  const serialized = filtered.map(serializeRow);
  return c.json(sortCompanies(serialized, starsMap));
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
