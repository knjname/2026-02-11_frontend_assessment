import { createFileRoute } from "@tanstack/react-router";
import { getAuditLogsByLogId } from "@app/api";
import { AuditLogDetail } from "@/features/audit-logs/audit-log-detail";

export const Route = createFileRoute("/_authenticated/audit-logs/$logId")({
  loader: async ({ params }) => {
    const { data } = await getAuditLogsByLogId({
      path: { logId: Number(params.logId) },
    });
    return data!;
  },
  component: AuditLogDetailPage,
});

function AuditLogDetailPage() {
  const log = Route.useLoaderData();
  return <AuditLogDetail log={log} />;
}
