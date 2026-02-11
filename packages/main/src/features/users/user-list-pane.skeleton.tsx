import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserListPaneSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
      <ScrollArea className="flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b px-3 py-2.5">
            <Skeleton className="size-8 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
