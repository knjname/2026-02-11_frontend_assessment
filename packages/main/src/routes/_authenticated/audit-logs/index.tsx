import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/audit-logs/")({
  component: AuditLogsIndex,
});

function AuditLogsIndex() {
  return (
    <EmptyState
      icon={<ScrollText className="size-10" />}
      title="ログを選択してください"
      description="左の一覧からログを選択すると、詳細が表示されます"
    />
  );
}
