import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getUsers } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListPane } from "@/features/users/user-list-pane";
import { UserListPaneSkeleton } from "@/features/users/user-list-pane.skeleton";

const usersSearchSchema = z.object({
  q: z.string().optional(),
  role: z.enum(["admin", "member"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

export const Route = createFileRoute("/_authenticated/users")({
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const { data } = await getUsers({
      query: { q: deps.q, role: deps.role, page: deps.page, pageSize: 20 },
    });
    return data!;
  },
  pendingComponent: UsersLayout,
  pendingMs: 200,
  pendingMinMs: 300,
  component: UsersLayout,
});

function UsersLayout() {
  const search = Route.useSearch();
  const { loaderData } = Route.useMatch();
  const [staleData, setStaleData] = useState(loaderData);

  if (loaderData && loaderData !== staleData) {
    setStaleData(loaderData);
  }

  const data = loaderData ?? staleData;

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
