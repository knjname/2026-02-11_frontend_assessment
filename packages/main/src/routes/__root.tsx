import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/features/auth/api-client";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <TooltipProvider>
      <Outlet />
      <Toaster />
    </TooltipProvider>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">ページが見つかりませんでした</h1>
      <p className="text-muted-foreground">
        お探しのページは存在しないか、削除された可能性があります。
      </p>
      <Link to="/" className="text-primary underline">
        ホームに戻る
      </Link>
    </div>
  );
}
