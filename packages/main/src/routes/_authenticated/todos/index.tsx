import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/todos/")({
  component: TodosIndex,
});

function TodosIndex() {
  return (
    <EmptyState
      icon={<CheckSquare className="size-10" />}
      title="ToDoを選択してください"
      description="左の一覧からToDoを選択すると、詳細が表示されます"
    />
  );
}
