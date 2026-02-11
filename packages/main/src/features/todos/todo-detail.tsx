import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Todo } from "@app/api";
import { putTodosByTodoId, deleteTodosByTodoId } from "@app/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FormTextField, FormTextareaField, FormSelectField } from "@/components/form-fields";
import { todoUpdateSchema, type TodoUpdateForm } from "./todo-schemas";

export function TodoDetail({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<TodoUpdateForm>({
    resolver: zodResolver(todoUpdateSchema),
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
    queryClient.invalidateQueries({ queryKey: ["todos"] });
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
    queryClient.invalidateQueries({ queryKey: ["todos"] });
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
              <FormTextField control={form.control} name="title" label="タイトル" />
              <FormTextareaField control={form.control} name="description" label="説明" rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <FormSelectField
                  control={form.control}
                  name="status"
                  label="ステータス"
                  options={[
                    { value: "pending", label: "未着手" },
                    { value: "in_progress", label: "進行中" },
                    { value: "done", label: "完了" },
                  ]}
                />
                <FormSelectField
                  control={form.control}
                  name="priority"
                  label="優先度"
                  options={[
                    { value: "high", label: "高" },
                    { value: "medium", label: "中" },
                    { value: "low", label: "低" },
                  ]}
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
