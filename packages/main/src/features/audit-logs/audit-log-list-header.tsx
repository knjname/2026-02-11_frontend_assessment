import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actionLabels } from "./audit-log-labels";

type AuditLogAction =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "todo.created"
  | "todo.updated"
  | "todo.completed"
  | "todo.deleted"
  | "auth.login"
  | "auth.logout";

type AuditLogListHeaderProps = {
  search: {
    action?: AuditLogAction;
    targetType?: "user" | "todo" | "session";
    page?: number;
  };
  total?: number;
};

export function AuditLogListHeader({ search, total }: AuditLogListHeaderProps) {
  const navigate = useNavigate();

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: "/audit-logs",
      search: { ...search, ...updates, page: updates.page ?? 1 },
    });
  };

  return (
    <div className="space-y-2 border-b p-3">
      <h2 className="text-sm font-semibold">監査ログ{total != null ? ` (${total})` : ""}</h2>
      <Select
        value={search.action ?? "all"}
        onValueChange={(v) =>
          updateSearch({ action: v === "all" ? undefined : (v as AuditLogAction) })
        }
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
  );
}
