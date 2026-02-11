import { createFileRoute, Outlet } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getUsers } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListBody } from "@/features/users/user-list-pane";
import { UserListBodySkeleton } from "@/features/users/user-list-pane.skeleton";
import { UserListHeader } from "@/features/users/user-list-header";

const usersSearchSchema = z.object({
  q: z.string().optional(),
  role: z.enum(["admin", "member"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function UsersLayout() {
  const search = Route.useSearch();
  const { data } = useQuery({
    queryKey: ["users", { q: search.q, role: search.role, page: search.page }],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await getUsers({
        query: { q: search.q, role: search.role, page: search.page, pageSize: 20 },
      });
      if (error) throw error;
      return data!;
    },
  });

  return (
    <MasterDetailLayout
      list={
        <div className="flex h-full flex-col">
          <UserListHeader search={search} total={data?.total} />
          {data ? <UserListBody users={data.items} search={search} /> : <UserListBodySkeleton />}
        </div>
      }
      detail={data ? <Outlet /> : <div />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/users")({
  validateSearch: usersSearchSchema,
  component: UsersLayout,
});
