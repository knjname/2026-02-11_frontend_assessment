import { Link, useNavigate } from "@tanstack/react-router";
import type { User } from "@app/api";
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

type Props = {
  users: User[];
  total: number;
  search: { q?: string; role?: "admin" | "member"; page?: number };
  selectedId?: number;
};

export function UserListPane({ users, total, search, selectedId }: Props) {
  const navigate = useNavigate();

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: "/users",
      search: { ...search, ...updates, page: updates.page ?? 1 },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">ユーザー ({total})</h2>
          <div className="flex-1" />
          <Button size="sm" asChild>
            <Link to="/users/new" search={search}>
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
            onChange={(e) => updateSearch({ q: e.target.value || undefined })}
          />
        </div>
        <Select
          value={search.role ?? "all"}
          onValueChange={(v) =>
            updateSearch({ role: v === "all" ? undefined : (v as "admin" | "member") })
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="ロール" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのロール</SelectItem>
            <SelectItem value="admin">管理者</SelectItem>
            <SelectItem value="member">メンバー</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1">
        {users.map((user) => (
          <Link
            key={user.id}
            to="/users/$userId"
            params={{ userId: String(user.id) }}
            search={search}
            className={`flex items-center gap-3 border-b px-3 py-2.5 text-sm hover:bg-accent ${
              selectedId === user.id ? "bg-accent" : ""
            }`}
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {user.displayName.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{user.displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className="text-[10px]"
            >
              {user.role === "admin" ? "管理者" : "メンバー"}
            </Badge>
          </Link>
        ))}
        {users.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">ユーザーが見つかりません</p>
        )}
      </ScrollArea>
    </div>
  );
}
