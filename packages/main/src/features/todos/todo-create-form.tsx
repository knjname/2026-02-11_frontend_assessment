import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postTodos } from "@app/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormTextField, FormTextareaField, FormSelectField } from "@/components/form-fields";
import { todoCreateSchema, type TodoCreateForm as TodoCreateFormType } from "./todo-schemas";

export function TodoCreateForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<TodoCreateFormType>({
    resolver: zodResolver(todoCreateSchema),
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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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
              <FormTextField control={form.control} name="title" label="タイトル" />
              <FormTextareaField control={form.control} name="description" label="説明" rows={3} />
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
