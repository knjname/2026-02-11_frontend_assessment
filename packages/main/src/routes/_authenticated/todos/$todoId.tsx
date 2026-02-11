import { createFileRoute } from "@tanstack/react-router";
import { getTodosByTodoId } from "@app/api";
import { TodoDetail } from "@/features/todos/todo-detail";
import { TodoDetailSkeleton } from "@/features/todos/todo-detail.skeleton";

export const Route = createFileRoute("/_authenticated/todos/$todoId")({
  loader: async ({ params }) => {
    const { data } = await getTodosByTodoId({
      path: { todoId: Number(params.todoId) },
    });
    return data!;
  },
  pendingComponent: TodoDetailSkeleton,
  pendingMs: 200,
  pendingMinMs: 300,
  component: TodoDetailPage,
});

function TodoDetailPage() {
  const todo = Route.useLoaderData();
  return <TodoDetail todo={todo} />;
}
