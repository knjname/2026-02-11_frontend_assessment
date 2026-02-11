import { createFileRoute } from "@tanstack/react-router";
import { UserCreateForm } from "@/features/users/user-create-form";

export const Route = createFileRoute("/_authenticated/users/new")({
  component: UserCreateForm,
});
