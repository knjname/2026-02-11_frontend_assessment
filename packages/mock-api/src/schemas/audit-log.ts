import { z } from "@hono/zod-openapi";

export const AuditActionSchema = z.enum([
  "user.created",
  "user.updated",
  "user.deleted",
  "todo.created",
  "todo.updated",
  "todo.completed",
  "todo.deleted",
  "auth.login",
  "auth.logout",
]);

export const AuditTargetTypeSchema = z.enum(["user", "todo", "session"]);

export const AuditLogEntrySchema = z
  .object({
    id: z.number(),
    timestamp: z.string().datetime(),
    action: AuditActionSchema,
    actorId: z.number(),
    actorName: z.string(),
    targetType: AuditTargetTypeSchema,
    targetId: z.number(),
    details: z.string(),
  })
  .openapi("AuditLogEntry");
