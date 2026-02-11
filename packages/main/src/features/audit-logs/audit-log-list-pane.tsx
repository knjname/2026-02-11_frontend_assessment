import { Link, useNavigate } from "@tanstack/react-router";
import type { AuditLogEntry } from "@app/api";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  logs: AuditLogEntry[];
  total: number;
  search: {
    action?: string;
    targetType?: "user" | "todo" | "session";
    page?: number;
  };
  selectedId?: number;
};

const actionLabels: Record<string, string> = {
  "user.created": "ユーザー作成",
  "user.updated": "ユーザー更新",
  "user.deleted": "ユーザー削除",
  "todo.created": "ToDo作成",
  "todo.updated": "ToDo更新",
  "todo.completed": "ToDo完了",
  "todo.deleted": "ToDo削除",
  "auth.login": "ログイン",
  "auth.logout": "ログアウト",
};

export function AuditLogListPane({ logs, total, search, selectedId }: Props) {
  const navigate = useNavigate();

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: "/audit-logs",
      search: { ...search, ...updates, page: updates.page ?? 1 },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <h2 className="text-sm font-semibold">監査ログ ({total})</h2>
        <Select
          value={search.action ?? "all"}
          onValueChange={(v) => updateSearch({ action: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="アクション" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのアクション</SelectItem>
            {Object.entries(actionLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={search.targetType ?? "all"}
          onValueChange={(v) =>
            updateSearch({
              targetType: v === "all" ? undefined : (v as "user" | "todo" | "session"),
            })
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="対象種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての対象</SelectItem>
            <SelectItem value="user">ユーザー</SelectItem>
            <SelectItem value="todo">ToDo</SelectItem>
            <SelectItem value="session">セッション</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1">
        {logs.map((log) => (
          <Link
            key={log.id}
            to="/audit-logs/$logId"
            params={{ logId: String(log.id) }}
            search={search}
            className={`block border-b px-3 py-2.5 text-sm hover:bg-accent ${
              selectedId === log.id ? "bg-accent" : ""
            }`}
          >
            <p className="truncate text-xs">{log.details}</p>
            <div className="mt-1 flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">
                {actionLabels[log.action] ?? log.action}
              </Badge>
              <time className="text-[10px] text-muted-foreground">
                {new Date(log.timestamp).toLocaleDateString("ja-JP")}
              </time>
            </div>
          </Link>
        ))}
        {logs.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">ログが見つかりません</p>
        )}
      </ScrollArea>
    </div>
  );
}
