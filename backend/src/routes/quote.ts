import { Hono } from "hono";
import { db } from "../db";

const quote = new Hono();

quote.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON" }, 400);

  const { companySlug, name, email, projectDescription, serviceType } = body;

  if (!companySlug || !name || !email || !projectDescription) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const company = db
    .query("SELECT id FROM companies WHERE slug = ? AND approved = 1")
    .get(companySlug);

  if (!company) return c.json({ error: "Company not found" }, 404);

  db.run(
    `INSERT INTO quote_requests (company_slug, name, email, project_description, service_type)
     VALUES (?, ?, ?, ?, ?)`,
    [companySlug, name, email, projectDescription, serviceType ?? ""]
  );

  return c.json({ success: true }, 201);
});

export default quote;
