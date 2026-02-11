import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getTodos } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { TodoListPane } from "@/features/todos/todo-list-pane";
import { TodoListPaneSkeleton } from "@/features/todos/todo-list-pane.skeleton";

const todosSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

export const Route = createFileRoute("/_authenticated/todos")({
  validateSearch: todosSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const { data } = await getTodos({
      query: {
        q: deps.q,
        status: deps.status,
        priority: deps.priority,
        page: deps.page,
        pageSize: 20,
      },
    });
    return data!;
  },
  pendingComponent: TodosLayoutPending,
  pendingMs: 200,
  pendingMinMs: 300,
  component: TodosLayout,
});

function TodosLayoutPending() {
  const search = Route.useSearch();
  return <MasterDetailLayout list={<TodoListPaneSkeleton search={search} />} detail={<div />} />;
}

function TodosLayout() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <MasterDetailLayout
      list={<TodoListPane todos={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}
