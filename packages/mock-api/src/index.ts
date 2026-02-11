import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import todos from "./routes/todos.js";
import auditLogs from "./routes/audit-logs.js";
import stats from "./routes/stats.js";

const app = new OpenAPIHono();

app.use("/*", cors());
app.use("/*", async (_c, next) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await next();
});

app.route("/auth", auth);
app.route("/users", users);
app.route("/todos", todos);
app.route("/audit-logs", auditLogs);
app.route("/stats", stats);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Admin API",
    version: "1.0.0",
    description: "B2B管理画面用モックAPI",
  },
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Mock API server running at http://localhost:${info.port}`);
});
