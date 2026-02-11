import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  TodoSchema,
  NewTodoSchema,
  UpdateTodoSchema,
  TodoStatusSchema,
  TodoPrioritySchema,
} from "../schemas/todo.js";
import { ErrorSchema, PaginationQuerySchema } from "../schemas/common.js";
import { users, todos, addAuditLog, counters } from "../data/seed.js";

const app = new OpenAPIHono();

function getCurrentUser(authHeader: string | undefined) {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer mock-token-(\d+)$/);
  if (!match) return null;
  return users.find((u) => u.id === Number(match[1])) ?? null;
}

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Todos"],
  summary: "ToDo一覧取得",
  request: {
    query: PaginationQuerySchema.extend({
      q: z.string().optional(),
      status: TodoStatusSchema.optional(),
      priority: TodoPrioritySchema.optional(),
      assigneeId: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(TodoSchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number(),
          }),
        },
      },
      description: "ToDo一覧",
    },
  },
});

app.openapi(listRoute, (c) => {
  const { q, status, priority, assigneeId, page, pageSize } = c.req.valid("query");
  let filtered = todos;
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        (t.description?.toLowerCase().includes(lower) ?? false),
    );
  }
  if (status) filtered = filtered.filter((t) => t.status === status);
  if (priority) filtered = filtered.filter((t) => t.priority === priority);
  if (assigneeId) filtered = filtered.filter((t) => t.assigneeId === assigneeId);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return c.json({ items, total, page, pageSize }, 200);
});

const createTodoRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Todos"],
  summary: "ToDo作成",
  request: {
    body: {
      content: { "application/json": { schema: NewTodoSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: TodoSchema } },
      description: "作成されたToDo",
    },
  },
});

app.openapi(createTodoRoute, (c) => {
  const body = c.req.valid("json");
  const actor = getCurrentUser(c.req.header("Authorization"));
  const now = new Date().toISOString();
  const todo = {
    id: counters.nextTodoId++,
    title: body.title,
    description: body.description,
    assigneeId: body.assigneeId,
    status: "pending" as const,
    priority: body.priority ?? ("medium" as const),
    createdAt: now,
    updatedAt: now,
  };
  todos.push(todo);
  addAuditLog({
    action: "todo.created",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "todo",
    targetId: todo.id,
    details: `ToDo「${todo.title}」を作成しました`,
  });
  return c.json(todo, 201);
});

const getTodoRoute = createRoute({
  method: "get",
  path: "/{todoId}",
  tags: ["Todos"],
  summary: "ToDo詳細取得",
  request: {
    params: z.object({ todoId: z.coerce.number() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: TodoSchema } },
      description: "ToDo詳細",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ToDoが見つかりません",
    },
  },
});

app.openapi(getTodoRoute, (c) => {
  const { todoId } = c.req.valid("param");
  const todo = todos.find((t) => t.id === todoId);
  if (!todo) {
    return c.json({ code: 404, message: "ToDoが見つかりません" }, 404);
  }
  return c.json(todo, 200);
});

const updateTodoRoute = createRoute({
  method: "put",
  path: "/{todoId}",
  tags: ["Todos"],
  summary: "ToDo更新",
  request: {
    params: z.object({ todoId: z.coerce.number() }),
    body: {
      content: { "application/json": { schema: UpdateTodoSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: TodoSchema } },
      description: "更新されたToDo",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ToDoが見つかりません",
    },
  },
});

app.openapi(updateTodoRoute, (c) => {
  const { todoId } = c.req.valid("param");
  const body = c.req.valid("json");
  const actor = getCurrentUser(c.req.header("Authorization"));
  const idx = todos.findIndex((t) => t.id === todoId);
  if (idx === -1) {
    return c.json({ code: 404, message: "ToDoが見つかりません" }, 404);
  }
  const todo = todos[idx];
  const wasCompleted = todo.status !== "done" && body.status === "done";
  if (body.title !== undefined) todo.title = body.title;
  if (body.description !== undefined) todo.description = body.description;
  if (body.assigneeId !== undefined) todo.assigneeId = body.assigneeId ?? undefined;
  if (body.status !== undefined) todo.status = body.status;
  if (body.priority !== undefined) todo.priority = body.priority;
  todo.updatedAt = new Date().toISOString();
  addAuditLog({
    action: wasCompleted ? "todo.completed" : "todo.updated",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "todo",
    targetId: todo.id,
    details: wasCompleted
      ? `ToDo「${todo.title}」を完了しました`
      : `ToDo「${todo.title}」を更新しました`,
  });
  return c.json(todo, 200);
});

const deleteTodoRoute = createRoute({
  method: "delete",
  path: "/{todoId}",
  tags: ["Todos"],
  summary: "ToDo削除",
  request: {
    params: z.object({ todoId: z.coerce.number() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
      description: "削除成功",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ToDoが見つかりません",
    },
  },
});

app.openapi(deleteTodoRoute, (c) => {
  const { todoId } = c.req.valid("param");
  const actor = getCurrentUser(c.req.header("Authorization"));
  const idx = todos.findIndex((t) => t.id === todoId);
  if (idx === -1) {
    return c.json({ code: 404, message: "ToDoが見つかりません" }, 404);
  }
  const todo = todos[idx];
  todos.splice(idx, 1);
  addAuditLog({
    action: "todo.deleted",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "todo",
    targetId: todo.id,
    details: `ToDo「${todo.title}」を削除しました`,
  });
  return c.json({ message: "ToDoを削除しました" }, 200);
});

export default app;
