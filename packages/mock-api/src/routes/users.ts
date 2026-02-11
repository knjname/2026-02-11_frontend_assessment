import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { UserSchema, NewUserSchema, UpdateUserSchema, UserRoleSchema } from "../schemas/user.js";
import { ErrorSchema, PaginationQuerySchema } from "../schemas/common.js";
import { users, addAuditLog, counters } from "../data/seed.js";

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
  tags: ["Users"],
  summary: "ユーザー一覧取得",
  request: {
    query: PaginationQuerySchema.extend({
      q: z.string().optional(),
      role: UserRoleSchema.optional(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(UserSchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number(),
          }),
        },
      },
      description: "ユーザー一覧",
    },
  },
});

app.openapi(listRoute, (c) => {
  const { q, role, page, pageSize } = c.req.valid("query");
  let filtered = users;
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.username.toLowerCase().includes(lower) ||
        u.displayName.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower),
    );
  }
  if (role) {
    filtered = filtered.filter((u) => u.role === role);
  }
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map(({ password: _, ...u }) => u);
  return c.json({ items, total, page, pageSize }, 200);
});

const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  summary: "ユーザー作成",
  request: {
    body: {
      content: { "application/json": { schema: NewUserSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: UserSchema } },
      description: "作成されたユーザー",
    },
    409: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ユーザー名が重複",
    },
  },
});

app.openapi(createUserRoute, (c) => {
  const body = c.req.valid("json");
  const actor = getCurrentUser(c.req.header("Authorization"));
  if (users.some((u) => u.username === body.username)) {
    return c.json({ code: 409, message: "このユーザー名は既に使用されています" }, 409);
  }
  const now = new Date().toISOString();
  const user = {
    id: counters.nextUserId++,
    username: body.username,
    email: body.email,
    role: body.role,
    displayName: body.displayName,
    password: body.password,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  addAuditLog({
    action: "user.created",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "user",
    targetId: user.id,
    details: `ユーザー「${user.displayName}」を作成しました`,
  });
  const { password: _, ...userWithoutPassword } = user;
  return c.json(userWithoutPassword, 201);
});

const getUserRoute = createRoute({
  method: "get",
  path: "/{userId}",
  tags: ["Users"],
  summary: "ユーザー詳細取得",
  request: {
    params: z.object({ userId: z.coerce.number() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: UserSchema } },
      description: "ユーザー詳細",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ユーザーが見つかりません",
    },
  },
});

app.openapi(getUserRoute, (c) => {
  const { userId } = c.req.valid("param");
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return c.json({ code: 404, message: "ユーザーが見つかりません" }, 404);
  }
  const { password: _, ...userWithoutPassword } = user;
  return c.json(userWithoutPassword, 200);
});

const updateUserRoute = createRoute({
  method: "put",
  path: "/{userId}",
  tags: ["Users"],
  summary: "ユーザー更新",
  request: {
    params: z.object({ userId: z.coerce.number() }),
    body: {
      content: { "application/json": { schema: UpdateUserSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: UserSchema } },
      description: "更新されたユーザー",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ユーザーが見つかりません",
    },
  },
});

app.openapi(updateUserRoute, (c) => {
  const { userId } = c.req.valid("param");
  const body = c.req.valid("json");
  const actor = getCurrentUser(c.req.header("Authorization"));
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return c.json({ code: 404, message: "ユーザーが見つかりません" }, 404);
  }
  const user = users[idx];
  if (body.email !== undefined) user.email = body.email;
  if (body.role !== undefined) user.role = body.role;
  if (body.displayName !== undefined) user.displayName = body.displayName;
  user.updatedAt = new Date().toISOString();
  addAuditLog({
    action: "user.updated",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "user",
    targetId: user.id,
    details: `ユーザー「${user.displayName}」の情報を更新しました`,
  });
  const { password: _, ...userWithoutPassword } = user;
  return c.json(userWithoutPassword, 200);
});

const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{userId}",
  tags: ["Users"],
  summary: "ユーザー削除",
  request: {
    params: z.object({ userId: z.coerce.number() }),
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
      description: "ユーザーが見つかりません",
    },
  },
});

app.openapi(deleteUserRoute, (c) => {
  const { userId } = c.req.valid("param");
  const actor = getCurrentUser(c.req.header("Authorization"));
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return c.json({ code: 404, message: "ユーザーが見つかりません" }, 404);
  }
  const user = users[idx];
  users.splice(idx, 1);
  addAuditLog({
    action: "user.deleted",
    actorId: actor?.id ?? 0,
    actorName: actor?.displayName ?? "system",
    targetType: "user",
    targetId: user.id,
    details: `ユーザー「${user.displayName}」を削除しました`,
  });
  return c.json({ message: "ユーザーを削除しました" }, 200);
});

export default app;
