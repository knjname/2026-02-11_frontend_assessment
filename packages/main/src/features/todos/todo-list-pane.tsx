import { useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { Todo } from "@app/api";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusLabels, priorityLabels } from "./todo-schemas";

type Props = {
  todos: Todo[];
  total: number;
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

export function TodoListPane({ todos, total, search, selectedId }: Props) {
  const navigate = useNavigate();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: "/todos",
      search: { ...search, ...updates, page: updates.page ?? 1 },
    });
  };

  const debouncedUpdateSearch = (updates: Partial<typeof search>) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => updateSearch(updates), 300);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">ToDo ({total})</h2>
          <div className="flex-1" />
          <Button size="sm" asChild>
            <Link to="/todos/new" search={search}>
              <Plus className="mr-1 size-3" />
              新規
            </Link>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="検索..."
            className="pl-8 h-8 text-sm"
            defaultValue={search.q ?? ""}
            onChange={(e) => debouncedUpdateSearch({ q: e.target.value || undefined })}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={search.status ?? "all"}
            onValueChange={(v) =>
              updateSearch({ status: v === "all" ? undefined : (v as Todo["status"]) })
            }
          >
            <SelectTrigger className="h-8 text-sm flex-1">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ステータス</SelectItem>
              <SelectItem value="pending">未着手</SelectItem>
              <SelectItem value="in_progress">進行中</SelectItem>
              <SelectItem value="done">完了</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={search.priority ?? "all"}
            onValueChange={(v) =>
              updateSearch({ priority: v === "all" ? undefined : (v as Todo["priority"]) })
            }
          >
            <SelectTrigger className="h-8 text-sm flex-1">
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全優先度</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
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
    </div>
  );
}
