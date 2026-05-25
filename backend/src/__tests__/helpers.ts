import { Hono } from "hono";
import companies from "../routes/companies";
import tools from "../routes/tools";

export function createTestApp() {
  const app = new Hono();
  app.route("/api/companies", companies);
  app.route("/api/tools", tools);
  return app;
}
