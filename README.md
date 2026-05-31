<div align="center">
  <h1>🔐 Web3 OpSec Directory</h1>
  <p><strong>Curated directory of Web3 security firms offering opsec, infrastructure, and web2 security services.</strong></p>
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![W3OSC](https://img.shields.io/badge/W3OSC-initiative-purple?style=flat-square)](https://github.com/W3OSC)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-runtime-f9f1e1?style=flat-square&logo=bun)](https://bun.sh/)
[![Maintained by Auditware](https://img.shields.io/badge/maintained%20by-Auditware-blue?style=flat-square)](https://auditware.io)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Stack](#stack)
- [Running Locally](#running-locally)
- [List Your Company with AI](#list-your-company-with-ai)
- [Adding a Company or Tool Manually](#adding-a-company-or-tool-manually)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

The **Web3 OpSec Directory** is an open, community-maintained registry of security firms that serve the Web3 ecosystem - covering smart contract auditing, operational security, infrastructure hardening, and web2 security services. Vetted and maintained by [Auditware](https://auditware.io).

---

## Stack

- **Frontend** - Next.js 15 (Turbopack)
- **Backend** - Bun + Hono
- **Data** - JSON files in `data/` (dev) / SQLite (prod)

---

## Running Locally

**Requirements:** Node.js 20+, Bun, PM2

```bash
make install-deps
make dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## List Your Company with AI

The fastest way to get listed is to send [`listing-prompt.md`](listing-prompt.md) to your AI of choice - attach the file, share the raw URL, or tell it to read the file directly.

The AI will:
1. Ask for your **GitHub** and **Twitter/X** handles
2. Automatically research your company from those profiles
3. Pre-fill as many fields as it can find
4. Ask you only for what's missing
5. Help you open a pull request

---

## Adding a Company or Tool Manually

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Running Tests

```bash
cd backend && bun test
```

---

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

---

## Contributors

<br>
<table>
<tr>
    <td align="center">
        <a href="https://github.com/forefy">
            <img src="https://avatars.githubusercontent.com/u/166978930?v=4" width="100;" alt="forefy"/>
            <br />
            <sub><b>forefy</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/avigaildanesh">
            <img src="https://avatars.githubusercontent.com/u/118690295?v=4" width="100;" alt="avigaildanesh"/>
            <br />
            <sub><b>avigaildanesh</b></sub>
        </a>
    </td>
</tr>
</table>
<br>

> **📢 Contributing to W3OS**
>
> W3OS is an open standard developed collaboratively by the Web3 security community. Contributions by anyone are welcome.
>
> - 📖 **Read the [Contributing Guide](CONTRIBUTING.md)** for detailed information on how to propose changes, add companies, and improve existing content
> - 💬 **Join the [Telegram Discussion Group](https://t.me/+yhmMnY2DyNBmNDlh)** to participate in ongoing collaboration and connect with other contributors
>
> _Help build the comprehensive operational security standard for Web3 organizations._

---

## License

MIT
