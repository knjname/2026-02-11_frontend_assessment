import { createFileRoute } from "@tanstack/react-router";
import { TodoCreateForm } from "@/features/todos/todo-create-form";

export const Route = createFileRoute("/_authenticated/todos/new")({
  component: TodoCreateForm,
});
