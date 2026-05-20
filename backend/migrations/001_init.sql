CREATE TABLE IF NOT EXISTS companies (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  website           TEXT NOT NULL,
  logo              TEXT,
  services          TEXT NOT NULL DEFAULT '[]',
  tags              TEXT NOT NULL DEFAULT '[]',
  endorsed          INTEGER NOT NULL DEFAULT 0,
  github            TEXT,
  twitter           TEXT,
  open_source_repos TEXT NOT NULL DEFAULT '[]',
  approved          INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tools (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  repo_url        TEXT NOT NULL,
  maintainer_slug TEXT NOT NULL,
  tags            TEXT NOT NULL DEFAULT '[]',
  stars           INTEGER,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name  TEXT NOT NULL,
  website       TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  services      TEXT NOT NULL DEFAULT '[]',
  description   TEXT NOT NULL,
  github_org    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  company_slug        TEXT NOT NULL,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  project_description TEXT NOT NULL,
  service_type        TEXT NOT NULL DEFAULT '',
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
