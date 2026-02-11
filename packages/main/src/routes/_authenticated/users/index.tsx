import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/users/")({
  component: UsersIndex,
});

function UsersIndex() {
  return (
    <EmptyState
      icon={<Users className="size-10" />}
      title="ユーザーを選択してください"
      description="左の一覧からユーザーを選択すると、詳細が表示されます"
    />
  );
}
