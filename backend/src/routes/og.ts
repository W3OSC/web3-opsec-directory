import { Hono } from "hono";
import { db } from "../db";
import type { Company } from "../types";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { join } from "path";

const og = new Hono();

// Place Inter-Bold.ttf in backend/assets/
let fontData: ArrayBuffer;
try {
  fontData = readFileSync(join(import.meta.dir, "../../assets/Inter-Bold.ttf")).buffer as ArrayBuffer;
} catch {
  fontData = new ArrayBuffer(0);
}

og.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = db
    .query("SELECT * FROM companies WHERE slug = ? AND approved = 1")
    .get(slug) as Company | null;

  if (!row) return c.json({ error: "Not found" }, 404);

  const tags: string[] = JSON.parse(row.tags ?? "[]");

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f0f0f",
          padding: "60px",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                {
                  type: "p",
                  props: {
                    style: { color: "#00ff88", fontSize: "20px", margin: 0 },
                    children: "W3OS Security Directory",
                  },
                },
                {
                  type: "h1",
                  props: {
                    style: {
                      color: "#ffffff",
                      fontSize: "72px",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.1,
                    },
                    children: row.name,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: { color: "#888888", fontSize: "28px", margin: 0 },
                    children: row.description?.slice(0, 100) ?? "",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", gap: "12px" },
              children: tags.slice(0, 4).map((tag) => ({
                type: "span",
                props: {
                  style: {
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#aaaaaa",
                    fontSize: "18px",
                    padding: "6px 16px",
                    borderRadius: "999px",
                  },
                  children: tag,
                },
              })),
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: fontData.byteLength
        ? [{ name: "Inter", data: fontData, weight: 700, style: "normal" }]
        : [],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
});

export default og;
