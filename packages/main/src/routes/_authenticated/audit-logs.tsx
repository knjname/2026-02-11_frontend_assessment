import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getAuditLogs } from "@app/api";
import type { GetAuditLogsData } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { AuditLogListPane } from "@/features/audit-logs/audit-log-list-pane";
import { AuditLogListPaneSkeleton } from "@/features/audit-logs/audit-log-list-pane.skeleton";

const auditLogsSearchSchema = z.object({
  action: z.string().optional(),
  targetType: z.enum(["user", "todo", "session"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

export const Route = createFileRoute("/_authenticated/audit-logs")({
  validateSearch: auditLogsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const { data } = await getAuditLogs({
      query: {
        action: deps.action as NonNullable<GetAuditLogsData["query"]>["action"],
        targetType: deps.targetType,
        page: deps.page,
        pageSize: 20,
      },
    });
    return data!;
  },
  pendingComponent: AuditLogsLayout,
  pendingMs: 200,
  pendingMinMs: 300,
  component: AuditLogsLayout,
});

function AuditLogsLayout() {
  const search = Route.useSearch();
  const { loaderData } = Route.useMatch();
  const [staleData, setStaleData] = useState(loaderData);

  if (loaderData && loaderData !== staleData) {
    setStaleData(loaderData);
  }

  const data = loaderData ?? staleData;

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
