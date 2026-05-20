import { Hono } from "hono";
import { db } from "../db";

const apply = new Hono();

apply.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON" }, 400);

  const { companyName, website, contactEmail, services, description, githubOrg } = body;

  if (!companyName || !website || !contactEmail || !description) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return c.json({ error: "Invalid email" }, 400);
  }
  try { const u = new URL(website); if (!["http:", "https:"].includes(u.protocol)) throw new Error(); }
  catch { return c.json({ error: "Invalid website URL" }, 400); }

  db.run(
    `INSERT INTO applications (company_name, website, contact_email, services, description, github_org)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      companyName,
      website,
      contactEmail,
      JSON.stringify(services ?? []),
      description,
      githubOrg ?? null,
    ]
  );

  return c.json({ success: true }, 201);
});

export default apply;
