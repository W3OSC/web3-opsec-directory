# W3OS - Web3 Security Directory

Curated directory of web3 security firms offering opsec, infrastructure, and web2 security services. Vetted and maintained by [Auditware](https://auditware.io).

## Stack

- **Frontend** - Next.js 15 (Turbopack)
- **Backend** - Bun + Hono
- **Data** - JSON files in `data/` (dev) / SQLite (prod)

## Running Locally

**Requirements:** Node.js 20+, Bun, PM2

```bash
make install-deps
make dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## List Your Company with AI

The fastest way to get listed is to send [`listing-prompt.md`](listing-prompt.md) to your AI of choice - attach the file, share the raw URL, or tell it to read the file directly.

The AI will:
1. Ask for your **GitHub** and **Twitter/X** handles
2. Automatically research your company from those profiles
3. Pre-fill as many fields as it can find
4. Ask you only for what's missing
5. Help you open a pull request

## Adding a Company or Tool Manually

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Running Tests

```bash
cd backend && bun test
```

## Project Structure

```
data/
  companies/     # one JSON file per company
  tools/         # one JSON file per tool
  *.schema.json  # JSON schemas for validation
frontend/        # Next.js app
backend/         # Bun/Hono API
scripts/         # data validation script
```

## License

MIT
