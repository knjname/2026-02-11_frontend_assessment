import { z } from "zod";

export const userCreateSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["admin", "member"]),
  displayName: z.string().min(1, "表示名を入力してください"),
  password: z.string().min(4, "パスワードは4文字以上で入力してください"),
});

export const userUpdateSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください").optional(),
  role: z.enum(["admin", "member"]).optional(),
  displayName: z.string().min(1, "表示名を入力してください").optional(),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>;
export type UserUpdateForm = z.infer<typeof userUpdateSchema>;
