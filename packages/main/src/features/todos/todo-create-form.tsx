import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postTodos } from "@app/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { todoCreateSchema, type TodoCreateForm as TodoCreateFormType } from "./todo-schemas";

export function TodoCreateForm() {
  const router = useRouter();
  const navigate = useNavigate();

  const form = useForm<TodoCreateFormType>({
    resolver: zodResolver(todoCreateSchema) as never,
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = async (data: TodoCreateFormType) => {
    const { data: result, error } = await postTodos({ body: data });
    if (error) {
      toast.error("作成に失敗しました");
      return;
    }
    if (result) {
      toast.success("ToDoを作成しました");
      router.invalidate();
      navigate({ to: "/todos/$todoId", params: { todoId: String(result.id) } });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>新規ToDo作成</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>優先度</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "作成中..." : "作成"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: "/todos" })}>
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
