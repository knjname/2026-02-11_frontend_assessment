import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuditLogListPaneSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
      <ScrollArea className="flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="block border-b px-3 py-2.5">
            <Skeleton className="h-3 w-56" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
