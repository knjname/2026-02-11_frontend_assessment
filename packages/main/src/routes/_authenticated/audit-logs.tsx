import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getAuditLogs } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { AuditLogListBody } from "@/features/audit-logs/audit-log-list-pane";
import { AuditLogListBodySkeleton } from "@/features/audit-logs/audit-log-list-pane.skeleton";
import { AuditLogListHeader } from "@/features/audit-logs/audit-log-list-header";

const auditLogActions = [
  "user.created",
  "user.updated",
  "user.deleted",
  "todo.created",
  "todo.updated",
  "todo.completed",
  "todo.deleted",
  "auth.login",
  "auth.logout",
] as const;

const auditLogsSearchSchema = z.object({
  action: z.enum(auditLogActions).optional(),
  targetType: z.enum(["user", "todo", "session"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function AuditLogsLayout() {
  const { logId } = useParams({ strict: false }) as { logId?: string };
  const search = Route.useSearch();
  const { data } = useQuery({
    queryKey: [
      "audit-logs",
      { action: search.action, targetType: search.targetType, page: search.page },
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await getAuditLogs({
        query: {
          action: search.action,
          targetType: search.targetType,
          page: search.page,
          pageSize: 20,
        },
      });
      if (error) throw error;
      return data!;
    },
  });

  return (
    <MasterDetailLayout
      list={
        <div className="flex h-full flex-col">
          <AuditLogListHeader search={search} total={data?.total} />
          {data ? (
            <AuditLogListBody logs={data.items} search={search} selectedId={logId ? Number(logId) : undefined} />
          ) : (
            <AuditLogListBodySkeleton />
          )}
        </div>
      }
      detail={data ? <Outlet /> : <div />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/audit-logs")({
  validateSearch: auditLogsSearchSchema,
  component: AuditLogsLayout,
});
