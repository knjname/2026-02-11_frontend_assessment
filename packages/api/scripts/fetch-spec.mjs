import { writeFileSync } from "node:fs";

const res = await fetch("http://localhost:3000/openapi.json");
if (!res.ok) {
  console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const json = await res.json();
writeFileSync("openapi.json", JSON.stringify(json, null, 2) + "\n");
