import { client } from "@app/api";
import { authStore } from "@/features/auth/auth";

client.setConfig({ baseUrl: "/api" });

client.interceptors.request.use((request) => {
  const token = authStore.token;
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  return request;
});
