import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthMe } from "@app/api";
import { authStore, setAuth, clearAuth } from "@/stores/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { UserMenu } from "@/components/user-menu";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (!authStore.token) {
      throw redirect({ to: "/login" });
    }
    if (!authStore.isAuthenticated) {
      try {
        const { data } = await getAuthMe();
        if (data) {
          setAuth(data, authStore.token!);
        } else {
          clearAuth();
          throw redirect({ to: "/login" });
        }
      } catch {
        clearAuth();
        throw redirect({ to: "/login" });
      }
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="flex-1" />
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <footer className="border-t px-4 py-2 text-center text-xs text-muted-foreground">
          &copy; 2026 ACME Corporation. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
