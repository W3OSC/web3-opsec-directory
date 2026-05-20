import { Hono } from "hono";
import { db } from "../db";
import type { Tool } from "../types";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const tools = new Hono();
const IS_DEV = process.env.NODE_ENV !== "production";
const TOOLS_DIR = join(import.meta.dir, "../../../data/tools");
const COMPANIES_DIR = join(import.meta.dir, "../../../data/companies");

type ToolJson = {
  slug: string;
  name: string;
  description: string;
  repo_url: string;
  maintainer_slug: string;
  tags: string[];
  stars?: number | null;
};

async function fromFiles(): Promise<ToolJson[]> {
  const files = (await readdir(TOOLS_DIR)).filter((f) => f.endsWith(".json"));
  return Promise.all(files.map((f) => readFile(join(TOOLS_DIR, f), "utf-8").then(JSON.parse)));
}

async function getMaintainer(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (IS_DEV) {
    try {
      return JSON.parse(await readFile(join(COMPANIES_DIR, `${slug}.json`), "utf-8"));
    } catch { return null; }
  }
  const row = db.query("SELECT slug, name, website, logo, endorsed FROM companies WHERE slug = ?").get(slug);
  return row ?? null;
}

tools.get("/", async (c) => {
  const search = (c.req.query("search") ?? "").toLowerCase();
  const maintainer = c.req.query("maintainer") ?? "";

  if (IS_DEV) {
    let all = await fromFiles();
    if (search) all = all.filter((t) =>
      t.name.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)
    );
    if (maintainer) all = all.filter((t) => t.maintainer_slug === maintainer);
    const withMaintainers = await Promise.all(
      all.map(async (t) => ({ ...t, maintainer: await getMaintainer(t.maintainer_slug) }))
    );
    return c.json(withMaintainers);
  }

  let query = "SELECT * FROM tools";
  const params: string[] = [];
  const conditions: string[] = [];
  if (maintainer) { conditions.push("maintainer_slug = ?"); params.push(maintainer); }
  if (search) { conditions.push("(name LIKE ? OR description LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY stars DESC, name ASC";
  const rows = db.query(query).all(...params) as Tool[];
  const withMaintainers = rows.map((t) => ({
    ...t,
    tags: JSON.parse(t.tags ?? "[]"),
    maintainer: db.query("SELECT slug, name, website, logo, endorsed FROM companies WHERE slug = ?").get(t.maintainer_slug) ?? null,
  }));
  return c.json(withMaintainers);
});

tools.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!/^[a-z0-9-]+$/.test(slug)) return c.json({ error: "Not found" }, 404);

  if (IS_DEV) {
    let data: ToolJson;
    try {
      data = JSON.parse(await readFile(join(TOOLS_DIR, `${slug}.json`), "utf-8"));
    } catch { return c.json({ error: "Not found" }, 404); }
    return c.json({ ...data, maintainer: await getMaintainer(data.maintainer_slug) });
  }

  const row = db.query("SELECT * FROM tools WHERE slug = ?").get(slug) as Tool | null;
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({
    ...row,
    tags: JSON.parse(row.tags ?? "[]"),
    maintainer: db.query("SELECT slug, name, website, logo, endorsed FROM companies WHERE slug = ?").get(row.maintainer_slug) ?? null,
  });
});

export default tools;
