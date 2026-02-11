import { Link } from "@tanstack/react-router";
import type { User } from "@app/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserListHeader } from "./user-list-header";

type Props = {
  users: User[];
  total: number;
  search: { q?: string; role?: "admin" | "member"; page?: number };
  selectedId?: number;
};

export function UserListPane({ users, total, search, selectedId }: Props) {
  return (
    <div className="flex h-full flex-col">
      <UserListHeader search={search} total={total} />
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
