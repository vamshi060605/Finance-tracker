import { Skeleton } from "./skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  fullScreen?: boolean;
}

export function Loading({ className, size = "default", fullScreen }: LoadingProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin",
        size === "sm" && "h-4 w-4",
        size === "default" && "h-8 w-8",
        size === "lg" && "h-12 w-12"
      )} />
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </div>
  );
}
