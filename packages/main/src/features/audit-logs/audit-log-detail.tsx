import type { AuditLogEntry } from "@app/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { actionLabels } from "./audit-log-labels";

const targetTypeLabels: Record<string, string> = {
  user: "ユーザー",
  todo: "ToDo",
  session: "セッション",
};

export function AuditLogDetail({ log }: { log: AuditLogEntry }) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>監査ログ詳細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">{log.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">日時</p>
              <p className="font-medium">{new Date(log.timestamp).toLocaleString("ja-JP")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">アクション</p>
              <Badge variant="outline">{actionLabels[log.action] ?? log.action}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">対象種別</p>
              <p className="font-medium">{targetTypeLabels[log.targetType] ?? log.targetType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">実行者</p>
              <p className="font-medium">
                {log.actorName} (ID: {log.actorId})
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">対象ID</p>
              <p className="font-medium">{log.targetId}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">詳細</p>
            <p className="mt-1 text-sm">{log.details}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
