import { useEffect, useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { getTodos } from "@app/api";
import type { Todo } from "@app/api";
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { TodoListPane } from "@/features/todos/todo-list-pane";
import { TodoListPaneSkeleton } from "@/features/todos/todo-list-pane.skeleton";

const todosSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  page: z.number().int().positive().optional().default(1),
});

function TodosLayout() {
  const search = Route.useSearch();
  const [data, setData] = useState<{ items: Todo[]; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTodos({
      query: {
        q: search.q,
        status: search.status,
        priority: search.priority,
        page: search.page,
        pageSize: 20,
      },
    }).then(({ data: result }) => {
      if (!cancelled) setData(result!);
    });
    return () => {
      cancelled = true;
    };
  }, [search.q, search.status, search.priority, search.page]);

  if (!data) {
    return <MasterDetailLayout list={<TodoListPaneSkeleton search={search} />} detail={<div />} />;
  }

  return (
    <MasterDetailLayout
      list={<TodoListPane todos={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}

export const Route = createFileRoute("/_authenticated/todos")({
  validateSearch: todosSearchSchema,
  component: TodosLayout,
});
