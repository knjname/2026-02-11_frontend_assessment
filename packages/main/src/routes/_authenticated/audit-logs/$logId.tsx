import { createFileRoute } from "@tanstack/react-router";
import { getAuditLogsByLogId } from "@app/api";
import { AuditLogDetail } from "@/features/audit-logs/audit-log-detail";
import { AuditLogDetailSkeleton } from "@/features/audit-logs/audit-log-detail.skeleton";

export const Route = createFileRoute("/_authenticated/audit-logs/$logId")({
  loader: async ({ params }) => {
    const { data } = await getAuditLogsByLogId({
      path: { logId: Number(params.logId) },
    });
    return data!;
  },
  pendingComponent: AuditLogDetailSkeleton,
  pendingMs: 200,
  pendingMinMs: 300,
  component: AuditLogDetailPage,
});

function AuditLogDetailPage() {
  const log = Route.useLoaderData();
  return <AuditLogDetail log={log} />;
}
