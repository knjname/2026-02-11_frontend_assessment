import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postUsers } from "@app/api";
import { toast } from "sonner";
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
import { userCreateSchema, type UserCreateForm as UserCreateFormType } from "./user-schemas";

export function UserCreateForm() {
  const router = useRouter();
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
      router.invalidate();
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
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ユーザー名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
