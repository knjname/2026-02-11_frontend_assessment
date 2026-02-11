import { Link } from "@tanstack/react-router";
import type { Todo } from "@app/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusLabels, priorityLabels } from "./todo-schemas";

type Props = {
  todos: Todo[];
  search: {
    q?: string;
    status?: "pending" | "in_progress" | "done";
    priority?: "low" | "medium" | "high";
    page?: number;
  };
  selectedId?: number;
};

const priorityColors: Record<string, "default" | "secondary" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
};

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  pending: "outline",
  in_progress: "secondary",
  done: "default",
};

export function TodoListBody({ todos, search, selectedId }: Props) {
  return (
    <ScrollArea className="flex-1">
      {todos.map((todo) => (
        <Link
          key={todo.id}
          to="/todos/$todoId"
          params={{ todoId: String(todo.id) }}
          search={search}
          className={`block border-b px-3 py-2.5 text-sm hover:bg-accent ${
            selectedId === todo.id ? "bg-accent" : ""
          }`}
        >
          <p
            className={`truncate font-medium ${todo.status === "done" ? "line-through text-muted-foreground" : ""}`}
          >
            {todo.title}
          </p>
          <div className="mt-1 flex gap-1.5">
            <Badge variant={statusColors[todo.status]} className="text-[10px]">
              {statusLabels[todo.status]}
            </Badge>
            <Badge variant={priorityColors[todo.priority]} className="text-[10px]">
              {priorityLabels[todo.priority]}
            </Badge>
          </div>
        </Link>
      ))}
      {todos.length === 0 && (
        <p className="p-4 text-center text-sm text-muted-foreground">ToDoが見つかりません</p>
      )}
    </ScrollArea>
  );
}
