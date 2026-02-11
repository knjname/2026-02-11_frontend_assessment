import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoDetailSkeleton() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
