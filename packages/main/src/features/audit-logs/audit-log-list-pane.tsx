import { Link } from "@tanstack/react-router";
import type { AuditLogEntry } from "@app/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuditLogListHeader } from "./audit-log-list-header";
import { actionLabels } from "./audit-log-labels";

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

export function AuditLogListPane({ logs, total, search, selectedId }: Props) {
  return (
    <div className="flex h-full flex-col">
      <AuditLogListHeader search={search} total={total} />
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
