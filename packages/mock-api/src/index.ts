import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import pets from "./routes/pets.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Hono();

app.get("/openapi.json", (c) => {
  const yamlPath = resolve(__dirname, "../openapi/petstore.yaml");
  const yamlContent = readFileSync(yamlPath, "utf-8");
  const doc = load(yamlContent);
  return c.json(doc);
});

app.route("/pets", pets);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Mock API server running at http://localhost:${info.port}`);
});
