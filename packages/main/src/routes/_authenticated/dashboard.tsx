import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@app/api";
import { Users, CheckSquare, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "./-dashboard.skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: async () => {
    const { data } = await getStats();
    return data!;
  },
  pendingComponent: DashboardSkeleton,
  pendingMs: 200,
  pendingMinMs: 300,
  component: DashboardPage,
});

function DashboardPage() {
  const stats = Route.useLoaderData();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ユーザー数"
          value={stats.users.total}
          icon={Users}
          description={`管理者 ${stats.users.admins} / メンバー ${stats.users.members}`}
        />
        <StatCard
          title="ToDo 合計"
          value={stats.todos.total}
          icon={CheckSquare}
          description={`完了 ${stats.todos.done} 件`}
        />
        <StatCard
          title="進行中"
          value={stats.todos.inProgress}
          icon={Clock}
          description="現在作業中のタスク"
        />
        <StatCard
          title="未着手"
          value={stats.todos.pending}
          icon={Activity}
          description="未対応のタスク"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.actorName}</p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString("ja-JP")}
                </time>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
