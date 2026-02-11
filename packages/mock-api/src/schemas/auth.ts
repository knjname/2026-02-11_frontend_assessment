import { z } from "@hono/zod-openapi";
import { UserSchema } from "./user.js";

export const LoginRequestSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .openapi("LoginRequest");

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: UserSchema,
  })
  .openapi("LoginResponse");
