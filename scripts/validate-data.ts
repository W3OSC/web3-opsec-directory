#!/usr/bin/env bun
/**
 * Validates all data/companies/*.json and data/tools/*.json against their schemas.
 * Also cross-validates:
 *   - tool.maintainer_slug must match an existing company slug
 *   - repo.tool_slug (in company) must match an existing tool slug
 *
 * Usage:
 *   bun run scripts/validate-data.ts            # validate all
 *   bun run scripts/validate-data.ts companies  # companies only
 *   bun run scripts/validate-data.ts tools      # tools only
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";

const ROOT = join(import.meta.dir, "..");
const COMPANIES_DIR = join(ROOT, "data/companies");
const TOOLS_DIR = join(ROOT, "data/tools");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const companySchema = JSON.parse(await readFile(join(ROOT, "data/company.schema.json"), "utf-8"));
const toolSchema = JSON.parse(await readFile(join(ROOT, "data/tool.schema.json"), "utf-8"));
const validateCompany = ajv.compile(companySchema);
const validateTool = ajv.compile(toolSchema);

const filter = process.argv[2] ?? "all";

async function loadAll(dir: string) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  const entries = await Promise.all(
    files.map(async (f) => ({
      file: f,
      slug: basename(f, ".json"),
      data: JSON.parse(await readFile(join(dir, f), "utf-8")),
    }))
  );
  return entries;
}

let failed = 0;
let total = 0;

function check(file: string, slug: string, data: unknown, validator: ReturnType<typeof ajv.compile>) {
  total++;
  const rec = data as Record<string, unknown>;

  if (rec.slug !== slug) {
    console.error(`❌ ${file}: slug field "${rec.slug}" must match filename "${slug}"`);
    failed++;
    return false;
  }

  if (!validator(data)) {
    console.error(`❌ ${file}:`);
    for (const err of validator.errors ?? []) {
      console.error(`   ${err.instancePath || "/"} — ${err.message}`);
      if (err.keyword === "enum") {
        console.error(`   Allowed: ${JSON.stringify((err.params as Record<string, unknown>).allowedValues)}`);
      }
    }
    failed++;
    return false;
  }

  return true;
}

// Load all for cross-validation
const companies = await loadAll(COMPANIES_DIR);
const tools = await loadAll(TOOLS_DIR);
const companySlugs = new Set(companies.map((c) => c.slug));
const toolSlugs = new Set(tools.map((t) => t.slug));

// Validate companies
if (filter === "all" || filter === "companies") {
  console.log("\n── Companies ──");
  for (const { file, slug, data } of companies) {
    const ok = check(file, slug, data, validateCompany);
    if (!ok) continue;

    // cross-validate tool_slug refs in open_source_repos
    const repos = (data as Record<string, unknown>).open_source_repos as Array<Record<string, unknown>> ?? [];
    for (const repo of repos) {
      if (repo.tool_slug && !toolSlugs.has(repo.tool_slug as string)) {
        console.error(`❌ ${file}: open_source_repos[].tool_slug "${repo.tool_slug}" not found in data/tools/`);
        failed++;
        continue;
      }
    }

    console.log(`✅ ${file}`);
  }
}

// Validate tools
if (filter === "all" || filter === "tools") {
  console.log("\n── Tools ──");
  for (const { file, slug, data } of tools) {
    const ok = check(file, slug, data, validateTool);
    if (!ok) continue;

    // cross-validate maintainer_slug
    const maintainer = (data as Record<string, unknown>).maintainer_slug as string;
    if (!companySlugs.has(maintainer)) {
      console.error(`❌ ${file}: maintainer_slug "${maintainer}" not found in data/companies/`);
      failed++;
      continue;
    }

    console.log(`✅ ${file}`);
  }
}

console.log(`\n${total - failed}/${total} valid`);
if (failed > 0) process.exit(1);
