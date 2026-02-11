import { useEffect, useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getUsers } from "@app/api";
import type { User } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListPane } from "@/features/users/user-list-pane";
import { UserListPaneSkeleton } from "@/features/users/user-list-pane.skeleton";

const usersSearchSchema = z.object({
  q: z.string().optional(),
  role: z.enum(["admin", "member"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function UsersLayout() {
  const search = Route.useSearch();
  const [data, setData] = useState<{ items: User[]; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUsers({
      query: { q: search.q, role: search.role, page: search.page, pageSize: 20 },
    }).then(({ data: result }) => {
      if (!cancelled) setData(result!);
    });
    return () => {
      cancelled = true;
    };
  }, [search.q, search.role, search.page]);

  if (!data) {
    return <MasterDetailLayout list={<UserListPaneSkeleton search={search} />} detail={<div />} />;
  }

  return (
    <MasterDetailLayout
      list={<UserListPane users={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/users")({
  validateSearch: usersSearchSchema,
  component: UsersLayout,
});
