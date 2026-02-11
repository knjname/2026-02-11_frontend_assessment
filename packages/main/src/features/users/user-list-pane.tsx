import { Link } from "@tanstack/react-router";
import type { User } from "@app/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { roleLabels } from "./user-labels";

type Props = {
  users: User[];
  search: { q?: string; role?: "admin" | "member"; page?: number };
  selectedId?: number;
};

export function UserListBody({ users, search, selectedId }: Props) {
  return (
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
          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px]">
            {roleLabels[user.role] ?? user.role}
          </Badge>
        </Link>
      ))}
      {users.length === 0 && (
        <p className="p-4 text-center text-sm text-muted-foreground">ユーザーが見つかりません</p>
      )}
    </ScrollArea>
  );
}
