import { Database } from "bun:sqlite";
import { readFileSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.DATABASE_URL ?? "./data/w3os.db";

export const db = new Database(DB_PATH, { create: true });

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

const migration = readFileSync(
  join(import.meta.dir, "../migrations/001_init.sql"),
  "utf-8"
);
db.run(migration);
