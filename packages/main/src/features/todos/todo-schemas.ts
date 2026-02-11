import { z } from "zod";

export const todoCreateSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  description: z.string().optional(),
  assigneeId: z.coerce.number().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const todoUpdateSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").optional(),
  description: z.string().optional(),
  assigneeId: z.coerce.number().nullable().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export type TodoCreateForm = z.input<typeof todoCreateSchema>;
export type TodoUpdateForm = z.input<typeof todoUpdateSchema>;

export const statusLabels: Record<string, string> = {
  pending: "未着手",
  in_progress: "進行中",
  done: "完了",
};

export const priorityLabels: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
};
