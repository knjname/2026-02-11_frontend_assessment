import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthMe } from "@app/api";
import { authStore, setAuth, clearAuth } from "@/features/auth/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <SidebarProvider className="flex-col">
      <header className="bg-background relative z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="md:hidden" />
        <span className="text-lg font-bold">ACME Admin</span>
        <div className="flex-1" />
        <UserMenu />
      </header>
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          <footer className="border-t px-4 py-2 text-center text-xs text-muted-foreground">
            &copy; 2026 ACME Corporation. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
