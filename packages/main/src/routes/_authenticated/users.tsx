import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getUsers } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListPane } from "@/features/users/user-list-pane";

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
  component: UsersLayout,
});

function UsersLayout() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <MasterDetailLayout
      list={<UserListPane users={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}
