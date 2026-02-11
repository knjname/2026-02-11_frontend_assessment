import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getTodos } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { TodoListBody } from "@/features/todos/todo-list-pane";
import { TodoListBodySkeleton } from "@/features/todos/todo-list-pane.skeleton";
import { TodoListHeader } from "@/features/todos/todo-list-header";

const todosSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function TodosLayout() {
  const { todoId } = useParams({ strict: false }) as { todoId?: string };
  const search = Route.useSearch();
  const { data } = useQuery({
    queryKey: [
      "todos",
      { q: search.q, status: search.status, priority: search.priority, page: search.page },
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await getTodos({
        query: {
          q: search.q,
          status: search.status,
          priority: search.priority,
          page: search.page,
          pageSize: 20,
        },
      });
      if (error) throw error;
      return data!;
    },
  });

  return (
    <MasterDetailLayout
      list={
        <div className="flex h-full flex-col">
          <TodoListHeader search={search} total={data?.total} />
          {data ? <TodoListBody todos={data.items} search={search} selectedId={todoId ? Number(todoId) : undefined} /> : <TodoListBodySkeleton />}
        </div>
      }
      detail={data ? <Outlet /> : <div />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/todos")({
  validateSearch: todosSearchSchema,
  component: TodosLayout,
});
