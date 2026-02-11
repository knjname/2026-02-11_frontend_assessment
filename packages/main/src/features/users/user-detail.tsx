import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@app/api";
import { putUsersByUserId, deleteUsersByUserId } from "@app/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FormTextField, FormSelectField } from "@/components/form-fields";
import { userUpdateSchema, type UserUpdateForm } from "./user-schemas";

export function UserDetail({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    },
  });

  const onSubmit = async (data: UserUpdateForm) => {
    const { error } = await putUsersByUserId({
      path: { userId: user.id },
      body: data,
    });
    if (error) {
      toast.error("更新に失敗しました");
      return;
    }
    toast.success("ユーザーを更新しました");
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await deleteUsersByUserId({ path: { userId: user.id } });
    setDeleting(false);
    if (error) {
      toast.error("削除に失敗しました");
      return;
    }
    toast.success("ユーザーを削除しました");
    setDeleteOpen(false);
    navigate({ to: "/users" });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ユーザー詳細</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-1 size-4" />
            削除
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-1 text-sm text-muted-foreground">
            <p>
              ID: {user.id} / ユーザー名: {user.username}
            </p>
            <p>作成日: {new Date(user.createdAt).toLocaleDateString("ja-JP")}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField control={form.control} name="displayName" label="表示名" />
              <FormTextField
                control={form.control}
                name="email"
                label="メールアドレス"
                type="email"
              />
              <FormSelectField
                control={form.control}
                name="role"
                label="ロール"
                options={[
                  { value: "admin", label: "管理者" },
                  { value: "member", label: "メンバー" },
                ]}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "保存中..." : "保存"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="ユーザーを削除"
        description={`「${user.displayName}」を削除してもよろしいですか？この操作は元に戻せません。`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
