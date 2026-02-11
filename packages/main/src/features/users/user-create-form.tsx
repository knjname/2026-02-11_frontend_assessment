import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postUsers } from "@app/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormTextField, FormSelectField } from "@/components/form-fields";
import { userCreateSchema, type UserCreateForm as UserCreateFormType } from "./user-schemas";

export function UserCreateForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<UserCreateFormType>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "member",
      displayName: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserCreateFormType) => {
    const { data: result, error } = await postUsers({ body: data });
    if (error) {
      toast.error("作成に失敗しました", {
        description: "ユーザー名が既に使用されている可能性があります",
      });
      return;
    }
    if (result) {
      toast.success("ユーザーを作成しました");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/users/$userId", params: { userId: String(result.id) } });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>新規ユーザー作成</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField control={form.control} name="username" label="ユーザー名" />
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
              <FormTextField
                control={form.control}
                name="password"
                label="パスワード"
                type="password"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "作成中..." : "作成"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: "/users" })}>
                  キャンセル
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
