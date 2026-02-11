import { z } from "@hono/zod-openapi";

export const UserRoleSchema = z.enum(["admin", "member"]);

export const UserSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    role: UserRoleSchema,
    displayName: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("User");

export const NewUserSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    role: UserRoleSchema,
    displayName: z.string().min(1),
    password: z.string().min(4),
  })
  .openapi("NewUser");

export const UpdateUserSchema = z
  .object({
    email: z.string().email().optional(),
    role: UserRoleSchema.optional(),
    displayName: z.string().min(1).optional(),
  })
  .openapi("UpdateUser");
