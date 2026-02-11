import { createFileRoute, notFound } from "@tanstack/react-router";
import { getUsersByUserId } from "@app/api";
import { UserDetail } from "@/features/users/user-detail";
import { UserDetailSkeleton } from "@/features/users/user-detail.skeleton";

export const Route = createFileRoute("/_authenticated/users/$userId")({
  loader: async ({ params }) => {
    const { data } = await getUsersByUserId({
      path: { userId: Number(params.userId) },
    });
    if (!data) throw notFound();
    return data;
  },
  pendingComponent: UserDetailSkeleton,
  pendingMs: 200,
  pendingMinMs: 300,
  component: UserDetailPage,
});

function UserDetailPage() {
  const user = Route.useLoaderData();
  return <UserDetail user={user} />;
}
