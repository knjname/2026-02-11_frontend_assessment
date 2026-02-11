import { createFileRoute } from "@tanstack/react-router";
import { getUsersByUserId } from "@app/api";
import { UserDetail } from "@/features/users/user-detail";

export const Route = createFileRoute("/_authenticated/users/$userId")({
  loader: async ({ params }) => {
    const { data } = await getUsersByUserId({
      path: { userId: Number(params.userId) },
    });
    return data!;
  },
  component: UserDetailPage,
});

function UserDetailPage() {
  const user = Route.useLoaderData();
  return <UserDetail user={user} />;
}
