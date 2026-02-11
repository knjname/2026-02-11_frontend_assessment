import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TodoListPaneSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="block border-b px-3 py-2.5">
            <Skeleton className="h-4 w-48" />
            <div className="mt-1 flex gap-1.5">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
