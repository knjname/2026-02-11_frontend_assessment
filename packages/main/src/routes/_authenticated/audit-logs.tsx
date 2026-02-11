import { useEffect, useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getAuditLogs } from "@app/api";
import type { AuditLogEntry, GetAuditLogsData } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { AuditLogListPane } from "@/features/audit-logs/audit-log-list-pane";
import { AuditLogListPaneSkeleton } from "@/features/audit-logs/audit-log-list-pane.skeleton";

const auditLogsSearchSchema = z.object({
  action: z.string().optional(),
  targetType: z.enum(["user", "todo", "session"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function AuditLogsLayout() {
  const search = Route.useSearch();
  const [data, setData] = useState<{ items: AuditLogEntry[]; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAuditLogs({
      query: {
        action: search.action as NonNullable<GetAuditLogsData["query"]>["action"],
        targetType: search.targetType,
        page: search.page,
        pageSize: 20,
      },
    }).then(({ data: result }) => {
      if (!cancelled) setData(result!);
    });
    return () => {
      cancelled = true;
    };
  }, [search.action, search.targetType, search.page]);

  if (!data) {
    return (
      <MasterDetailLayout list={<AuditLogListPaneSkeleton search={search} />} detail={<div />} />
    );
  }

  return (
    <MasterDetailLayout
      list={<AuditLogListPane logs={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/audit-logs")({
  validateSearch: auditLogsSearchSchema,
  component: AuditLogsLayout,
});
