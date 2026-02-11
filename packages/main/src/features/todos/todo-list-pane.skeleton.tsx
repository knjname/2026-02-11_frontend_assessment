import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TodoListBodySkeleton() {
  return (
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
  );
}
