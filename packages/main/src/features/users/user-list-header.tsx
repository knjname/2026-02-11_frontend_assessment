import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

type UserListHeaderProps = {
  search: { q?: string; role?: "admin" | "member"; page?: number };
  total?: number;
};

export function UserListHeader({ search, total }: UserListHeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: pathname as "/users",
      search: { ...search, ...updates, page: updates.page ?? 1 },
    });
  };

  const debouncedUpdateSearch = useDebouncedCallback(
    (updates: Partial<typeof search>) => updateSearch(updates),
    300,
  );

  return (
    <div className="space-y-2 border-b p-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">ユーザー{total != null ? ` (${total})` : ""}</h2>
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
          onChange={(e) => debouncedUpdateSearch({ q: e.target.value || undefined })}
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
  );
}
