import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "./db";
import { seedCompanies, seedTools } from "./seed";
import companies from "./routes/companies";
import tools from "./routes/tools";
import apply from "./routes/apply";
import quote from "./routes/quote";
import og from "./routes/og";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

app.get("/health", (c) => c.text("ok"));

app.route("/api/companies", companies);
app.route("/api/tools", tools);
app.route("/api/apply", apply);
app.route("/api/quote", quote);
app.route("/api/og", og);

const port = Number(process.env.PORT ?? 3001);
seedCompanies().then(() => seedTools()).then(() => {
  console.log(`Backend running on http://localhost:${port}`);
});

export default { port, fetch: app.fetch };
