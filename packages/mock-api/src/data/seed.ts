import type { z } from "@hono/zod-openapi";
import type { UserSchema } from "../schemas/user.js";
import type { TodoSchema } from "../schemas/todo.js";
import type { AuditLogEntrySchema } from "../schemas/audit-log.js";

export type User = z.infer<typeof UserSchema> & { password: string };
export type Todo = z.infer<typeof TodoSchema>;
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

const now = new Date();
const ts = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    displayName: "管理者",
    password: "admin",
    createdAt: ts(90),
    updatedAt: ts(10),
  },
  {
    id: 2,
    username: "tanaka",
    email: "tanaka@example.com",
    role: "member",
    displayName: "田中太郎",
    password: "password",
    createdAt: ts(60),
    updatedAt: ts(5),
  },
  {
    id: 3,
    username: "suzuki",
    email: "suzuki@example.com",
    role: "member",
    displayName: "鈴木花子",
    password: "password",
    createdAt: ts(45),
    updatedAt: ts(3),
  },
  {
    id: 4,
    username: "sato",
    email: "sato@example.com",
    role: "admin",
    displayName: "佐藤一郎",
    password: "password",
    createdAt: ts(30),
    updatedAt: ts(1),
  },
  {
    id: 5,
    username: "yamada",
    email: "yamada@example.com",
    role: "member",
    displayName: "山田美咲",
    password: "password",
    createdAt: ts(15),
    updatedAt: ts(0),
  },
];

export const todos: Todo[] = [
  {
    id: 1,
    title: "四半期レポート作成",
    description: "Q4の売上レポートを作成し、経営会議で発表する",
    assigneeId: 2,
    status: "in_progress",
    priority: "high",
    createdAt: ts(14),
    updatedAt: ts(2),
  },
  {
    id: 2,
    title: "新人研修資料準備",
    description: "4月入社の新人向け研修資料を準備する",
    assigneeId: 3,
    status: "pending",
    priority: "medium",
    createdAt: ts(10),
    updatedAt: ts(10),
  },
  {
    id: 3,
    title: "サーバーメンテナンス",
    description: "本番サーバーの定期メンテナンスを実施",
    assigneeId: 1,
    status: "done",
    priority: "high",
    createdAt: ts(20),
    updatedAt: ts(5),
  },
  {
    id: 4,
    title: "顧客ミーティング議事録",
    description: "先週の顧客ミーティングの議事録を作成して共有する",
    assigneeId: 2,
    status: "pending",
    priority: "low",
    createdAt: ts(7),
    updatedAt: ts(7),
  },
  {
    id: 5,
    title: "セキュリティ監査対応",
    description: "外部監査チームからの指摘事項に対応する",
    assigneeId: 4,
    status: "in_progress",
    priority: "high",
    createdAt: ts(12),
    updatedAt: ts(1),
  },
  {
    id: 6,
    title: "社内Wiki更新",
    description: "開発チームのWikiページを最新の情報に更新する",
    assigneeId: 5,
    status: "pending",
    priority: "low",
    createdAt: ts(3),
    updatedAt: ts(3),
  },
];

export const auditLogs: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: ts(90),
    action: "user.created",
    actorId: 1,
    actorName: "管理者",
    targetType: "user",
    targetId: 1,
    details: "ユーザー「管理者」を作成しました",
  },
  {
    id: 2,
    timestamp: ts(60),
    action: "user.created",
    actorId: 1,
    actorName: "管理者",
    targetType: "user",
    targetId: 2,
    details: "ユーザー「田中太郎」を作成しました",
  },
  {
    id: 3,
    timestamp: ts(45),
    action: "user.created",
    actorId: 1,
    actorName: "管理者",
    targetType: "user",
    targetId: 3,
    details: "ユーザー「鈴木花子」を作成しました",
  },
  {
    id: 4,
    timestamp: ts(20),
    action: "todo.created",
    actorId: 1,
    actorName: "管理者",
    targetType: "todo",
    targetId: 3,
    details: "ToDo「サーバーメンテナンス」を作成しました",
  },
  {
    id: 5,
    timestamp: ts(14),
    action: "todo.created",
    actorId: 2,
    actorName: "田中太郎",
    targetType: "todo",
    targetId: 1,
    details: "ToDo「四半期レポート作成」を作成しました",
  },
  {
    id: 6,
    timestamp: ts(5),
    action: "todo.completed",
    actorId: 1,
    actorName: "管理者",
    targetType: "todo",
    targetId: 3,
    details: "ToDo「サーバーメンテナンス」を完了しました",
  },
  {
    id: 7,
    timestamp: ts(3),
    action: "auth.login",
    actorId: 4,
    actorName: "佐藤一郎",
    targetType: "session",
    targetId: 4,
    details: "佐藤一郎がログインしました",
  },
  {
    id: 8,
    timestamp: ts(1),
    action: "user.updated",
    actorId: 1,
    actorName: "管理者",
    targetType: "user",
    targetId: 4,
    details: "ユーザー「佐藤一郎」の情報を更新しました",
  },
];

export const counters = {
  nextUserId: 6,
  nextTodoId: 7,
  nextAuditLogId: 9,
};

export function addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const log: AuditLogEntry = {
    ...entry,
    id: counters.nextAuditLogId++,
    timestamp: new Date().toISOString(),
  };
  auditLogs.push(log);
  return log;
}
