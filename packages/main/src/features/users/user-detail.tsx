import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@app/api";
import { putUsersByUserId, deleteUsersByUserId } from "@app/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { userUpdateSchema, type UserUpdateForm } from "./user-schemas";

export function UserDetail({ user }: { user: User }) {
  const router = useRouter();
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
    router.invalidate();
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
    router.invalidate();
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
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>表示名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ロール</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">管理者</SelectItem>
                        <SelectItem value="member">メンバー</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
