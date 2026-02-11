import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postAuthLogin } from "@app/api";
import { setAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "admin", password: "admin" },
  });

  const onSubmit = async (data: LoginForm) => {
    const { data: result, error } = await postAuthLogin({ body: data });
    if (error) {
      toast.error("ログインに失敗しました", {
        description: "ユーザー名またはパスワードが正しくありません",
      });
      return;
    }
    if (result) {
      setAuth(result.user, result.token);
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ACME Admin</CardTitle>
          <CardDescription>管理画面にログインしてください</CardDescription>
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
                      <Input placeholder="admin" {...field} />
                    </FormControl>
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
                      <Input type="password" placeholder="••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-xs text-muted-foreground">テスト用: admin / admin</p>
        </CardContent>
      </Card>
    </div>
  );
}
