import { z } from "@hono/zod-openapi";

export const TodoStatusSchema = z.enum(["pending", "in_progress", "done"]);
export const TodoPrioritySchema = z.enum(["low", "medium", "high"]);

export const TodoSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    assigneeId: z.number().optional(),
    status: TodoStatusSchema,
    priority: TodoPrioritySchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("Todo");

export const NewTodoSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    assigneeId: z.number().optional(),
    priority: TodoPrioritySchema.optional().default("medium"),
  })
  .openapi("NewTodo");

export const UpdateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assigneeId: z.number().nullable().optional(),
    status: TodoStatusSchema.optional(),
    priority: TodoPrioritySchema.optional(),
  })
  .openapi("UpdateTodo");
