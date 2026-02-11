import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Todo } from "@app/api";
import { putTodosByTodoId, deleteTodosByTodoId } from "@app/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { ConfirmDialog } from "@/components/confirm-dialog";
import { todoUpdateSchema, type TodoUpdateForm } from "./todo-schemas";

export function TodoDetail({ todo }: { todo: Todo }) {
  const router = useRouter();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<TodoUpdateForm>({
    resolver: zodResolver(todoUpdateSchema) as never,
    defaultValues: {
      title: todo.title,
      description: todo.description ?? "",
      status: todo.status,
      priority: todo.priority,
      assigneeId: todo.assigneeId,
    },
  });

  const onSubmit = async (data: TodoUpdateForm) => {
    const { assigneeId, ...rest } = data;
    const { error } = await putTodosByTodoId({
      path: { todoId: todo.id },
      body: { ...rest, assigneeId: assigneeId ?? undefined },
    });
    if (error) {
      toast.error("更新に失敗しました");
      return;
    }
    toast.success("ToDoを更新しました");
    router.invalidate();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await deleteTodosByTodoId({ path: { todoId: todo.id } });
    setDeleting(false);
    if (error) {
      toast.error("削除に失敗しました");
      return;
    }
    toast.success("ToDoを削除しました");
    setDeleteOpen(false);
    navigate({ to: "/todos" });
    router.invalidate();
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ToDo詳細</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-1 size-4" />
            削除
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-1 text-sm text-muted-foreground">
            <p>ID: {todo.id}</p>
            <p>作成日: {new Date(todo.createdAt).toLocaleDateString("ja-JP")}</p>
          </div>
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
                      <Textarea rows={3} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ステータス</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">未着手</SelectItem>
                          <SelectItem value="in_progress">進行中</SelectItem>
                          <SelectItem value="done">完了</SelectItem>
                        </SelectContent>
                      </Select>
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
              </div>
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
        title="ToDoを削除"
        description={`「${todo.title}」を削除してもよろしいですか？`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
