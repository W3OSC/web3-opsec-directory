import { Database } from "bun:sqlite";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.DATABASE_URL ?? "./data/w3os.db";

export const db = new Database(DB_PATH, { create: true });

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

const migrationsDir = join(import.meta.dir, "../migrations");
const migrationFiles = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
for (const file of migrationFiles) {
  const sql = readFileSync(join(migrationsDir, file), "utf-8");
  try {
    db.run(sql);
  } catch {
    // migration already applied (e.g. duplicate column), safe to ignore
  }
}
