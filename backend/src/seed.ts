import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { db } from "./db";

const COMPANIES_DIR = join(import.meta.dir, "../../data/companies");
const TOOLS_DIR = join(import.meta.dir, "../../data/tools");

export async function seedCompanies() {
  let files: string[];
  try {
    files = await readdir(COMPANIES_DIR);
  } catch {
    console.log("No data/companies dir found, skipping seed");
    return;
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const activeSlugs = jsonFiles.map((f) => f.replace(/\.json$/, ""));

  for (const file of jsonFiles) {
    const c = JSON.parse(await readFile(join(COMPANIES_DIR, file), "utf-8"));
    db.run(
      `INSERT INTO companies (slug, name, description, website, logo, services, tags, endorsed, github, twitter, open_source_repos, badges, standards, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name, description = excluded.description,
         website = excluded.website, logo = excluded.logo,
         services = excluded.services, tags = excluded.tags,
         endorsed = excluded.endorsed, github = excluded.github,
         twitter = excluded.twitter, open_source_repos = excluded.open_source_repos,
         badges = excluded.badges, standards = excluded.standards`,
      [
        c.slug, c.name, c.description, c.website, c.logo ?? "",
        JSON.stringify(c.services ?? []), JSON.stringify(c.tags ?? []),
        c.endorsed ? 1 : 0, c.github ?? null, c.twitter ?? null,
        JSON.stringify(c.open_source_repos ?? []),
        JSON.stringify(c.badges ?? []),
        JSON.stringify(c.standards ?? []),
      ]
    );
  }

  if (activeSlugs.length > 0) {
    const placeholders = activeSlugs.map(() => "?").join(", ");
    db.run(`DELETE FROM companies WHERE slug NOT IN (${placeholders})`, activeSlugs);
  }

  console.log(`Seeded ${jsonFiles.length} companies`);
}

export async function seedTools() {
  let files: string[];
  try {
    files = await readdir(TOOLS_DIR);
  } catch {
    console.log("No data/tools dir found, skipping seed");
    return;
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const activeSlugs = jsonFiles.map((f) => f.replace(/\.json$/, ""));

  for (const file of jsonFiles) {
    const t = JSON.parse(await readFile(join(TOOLS_DIR, file), "utf-8"));
    db.run(
      `INSERT INTO tools (slug, name, description, repo_url, maintainer_slug, tags, stars)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name, description = excluded.description,
         repo_url = excluded.repo_url, maintainer_slug = excluded.maintainer_slug,
         tags = excluded.tags, stars = excluded.stars`,
      [t.slug, t.name, t.description, t.repo_url, t.maintainer_slug,
       JSON.stringify(t.tags ?? []), t.stars ?? null]
    );
  }

  if (activeSlugs.length > 0) {
    const placeholders = activeSlugs.map(() => "?").join(", ");
    db.run(`DELETE FROM tools WHERE slug NOT IN (${placeholders})`, activeSlugs);
  }

  console.log(`Seeded ${jsonFiles.length} tools`);
}
