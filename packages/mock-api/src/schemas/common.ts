import { z } from "@hono/zod-openapi";

export const ErrorSchema = z
  .object({
    code: z.number(),
    message: z.string(),
  })
  .openapi("Error");

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
});
