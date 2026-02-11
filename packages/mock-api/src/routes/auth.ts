import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { LoginRequestSchema, LoginResponseSchema } from "../schemas/auth.js";
import { UserSchema } from "../schemas/user.js";
import { ErrorSchema } from "../schemas/common.js";
import { users, addAuditLog } from "../data/seed.js";

const app = new OpenAPIHono();

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "ログイン",
  request: {
    body: {
      content: { "application/json": { schema: LoginRequestSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: LoginResponseSchema } },
      description: "ログイン成功",
    },
    401: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "認証失敗",
    },
  },
});

app.openapi(loginRoute, (c) => {
  const { username, password } = c.req.valid("json");
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return c.json({ code: 401, message: "ユーザー名またはパスワードが正しくありません" }, 401);
  }
  const token = `mock-token-${user.id}`;
  addAuditLog({
    action: "auth.login",
    actorId: user.id,
    actorName: user.displayName,
    targetType: "session",
    targetId: user.id,
    details: `${user.displayName}がログインしました`,
  });
  const { password: _, ...userWithoutPassword } = user;
  return c.json({ token, user: userWithoutPassword }, 200);
});

const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  tags: ["Auth"],
  summary: "ログアウト",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
      description: "ログアウト成功",
    },
  },
});

app.openapi(logoutRoute, (c) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader) {
    const tokenMatch = authHeader.match(/^Bearer mock-token-(\d+)$/);
    if (tokenMatch) {
      const userId = Number(tokenMatch[1]);
      const user = users.find((u) => u.id === userId);
      if (user) {
        addAuditLog({
          action: "auth.logout",
          actorId: user.id,
          actorName: user.displayName,
          targetType: "session",
          targetId: user.id,
          details: `${user.displayName}がログアウトしました`,
        });
      }
    }
  }
  return c.json({ message: "ログアウトしました" }, 200);
});

const meRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Auth"],
  summary: "現在のユーザー情報取得",
  responses: {
    200: {
      content: { "application/json": { schema: UserSchema } },
      description: "現在のユーザー情報",
    },
    401: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "未認証",
    },
  },
});

app.openapi(meRoute, (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ code: 401, message: "認証が必要です" }, 401);
  }
  const tokenMatch = authHeader.match(/^Bearer mock-token-(\d+)$/);
  if (!tokenMatch) {
    return c.json({ code: 401, message: "無効なトークンです" }, 401);
  }
  const userId = Number(tokenMatch[1]);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return c.json({ code: 401, message: "ユーザーが見つかりません" }, 401);
  }
  const { password: _, ...userWithoutPassword } = user;
  return c.json(userWithoutPassword, 200);
});

export default app;
