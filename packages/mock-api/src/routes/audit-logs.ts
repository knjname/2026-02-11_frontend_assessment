import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  AuditLogEntrySchema,
  AuditActionSchema,
  AuditTargetTypeSchema,
} from "../schemas/audit-log.js";
import { ErrorSchema, PaginationQuerySchema } from "../schemas/common.js";
import { auditLogs } from "../data/seed.js";

const app = new OpenAPIHono();

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["AuditLogs"],
  summary: "監査ログ一覧取得",
  request: {
    query: PaginationQuerySchema.extend({
      action: AuditActionSchema.optional(),
      actorId: z.coerce.number().optional(),
      targetType: AuditTargetTypeSchema.optional(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(AuditLogEntrySchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number(),
          }),
        },
      },
      description: "監査ログ一覧",
    },
  },
});

app.openapi(listRoute, (c) => {
  const { action, actorId, targetType, page, pageSize } = c.req.valid("query");
  let filtered = [...auditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  if (action) filtered = filtered.filter((l) => l.action === action);
  if (actorId) filtered = filtered.filter((l) => l.actorId === actorId);
  if (targetType) filtered = filtered.filter((l) => l.targetType === targetType);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return c.json({ items, total, page, pageSize }, 200);
});

const getRoute = createRoute({
  method: "get",
  path: "/{logId}",
  tags: ["AuditLogs"],
  summary: "監査ログ詳細取得",
  request: {
    params: z.object({ logId: z.coerce.number() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: AuditLogEntrySchema } },
      description: "監査ログ詳細",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ログが見つかりません",
    },
  },
});

app.openapi(getRoute, (c) => {
  const { logId } = c.req.valid("param");
  const log = auditLogs.find((l) => l.id === logId);
  if (!log) {
    return c.json({ code: 404, message: "ログが見つかりません" }, 404);
  }
  return c.json(log, 200);
});

export default app;
