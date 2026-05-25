# Contributing to W3OS

The directory is open to any legitimate web3 security firm or open-source security tool. This guide covers how to add an entry and get it merged.

## Adding a Company

Create `data/companies/<your-slug>.json`. The slug must be lowercase, hyphen-separated, and match the filename.

```json
{
  "slug": "your-company",
  "name": "Your Company",
  "description": "One to three sentences describing what you do and who you serve.",
  "website": "https://yourcompany.com",
  "logo": "/logos/your-company.png",
  "services": ["opsec", "infrastructure"],
  "tags": ["opsec", "web3"],
  "endorsed": false,
  "github": "https://github.com/yourorg",
  "twitter": null,
  "open_source_repos": []
}
```

**Required fields:** `slug`, `name`, `description`, `website`, `services`, `tags`

**`services`** must be one or more of:
`opsec`, `infrastructure`, `web2-security`, `threat-intelligence`, `incident-response`, `red-team`, `security-training`, `devsecops`, `physical-security`, `osint`, `blockchain-forensics`, `key-management`

**`endorsed`** is set by maintainers only - leave it `false`.

**Logo** - place a square PNG/SVG in `frontend/public/logos/` and reference it as `/logos/your-company.png`. If you don't have one, omit the field or set it to `""`.

## Adding a Tool

Create `data/tools/<your-slug>.json`. The `maintainer_slug` must point to an existing company in `data/companies/`.

```json
{
  "slug": "your-tool",
  "name": "Your Tool",
  "description": "What the tool does and the problem it solves.",
  "repo_url": "https://github.com/yourorg/your-tool",
  "maintainer_slug": "your-company",
  "tags": ["open-source", "scanner"],
  "stars": 0
}
```

**Required fields:** `slug`, `name`, `description`, `repo_url`, `maintainer_slug`, `tags`

## Validating Your Entry

Before opening a PR, run the validation script:

```bash
bun run validate
```

This checks your JSON against the schema and cross-validates references (tool maintainers, repo slugs). Fix any errors it reports.

## Running the App Locally

To preview your entry in the actual UI:

```bash
make install-deps
make dev
```

Open http://localhost:3000 - your entry will appear without any restart needed (dev mode reads files live).

## Running Tests

```bash
cd backend && bun test
```

Tests validate that all entries load correctly through the API, have required fields, valid URLs, and that every tool's `maintainer_slug` resolves to a real company.

## Opening a PR

1. Fork the repo
2. Create a branch: `git checkout -b add/your-company`
3. Add your JSON file (and logo if applicable)
4. Run `bun run validate` - must pass with no errors
5. Open a PR against `main`

PRs are reviewed for legitimacy and quality. We may ask for clarifications or edits before merging.
