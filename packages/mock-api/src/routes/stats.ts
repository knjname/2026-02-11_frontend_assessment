import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { users, todos, auditLogs } from "../data/seed.js";

const app = new OpenAPIHono();

const StatsSchema = z
  .object({
    users: z.object({
      total: z.number(),
      admins: z.number(),
      members: z.number(),
    }),
    todos: z.object({
      total: z.number(),
      pending: z.number(),
      inProgress: z.number(),
      done: z.number(),
    }),
    recentActivity: z.array(
      z.object({
        id: z.number(),
        timestamp: z.string(),
        action: z.string(),
        actorName: z.string(),
        details: z.string(),
      }),
    ),
  })
  .openapi("Stats");

const statsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Stats"],
  summary: "ダッシュボード統計情報取得",
  responses: {
    200: {
      content: { "application/json": { schema: StatsSchema } },
      description: "統計情報",
    },
  },
});

app.openapi(statsRoute, (c) => {
  const stats = {
    users: {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      members: users.filter((u) => u.role === "member").length,
    },
    todos: {
      total: todos.length,
      pending: todos.filter((t) => t.status === "pending").length,
      inProgress: todos.filter((t) => t.status === "in_progress").length,
      done: todos.filter((t) => t.status === "done").length,
    },
    recentActivity: [...auditLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(({ id, timestamp, action, actorName, details }) => ({
        id,
        timestamp,
        action,
        actorName,
        details,
      })),
  };
  return c.json(stats, 200);
});

export default app;
