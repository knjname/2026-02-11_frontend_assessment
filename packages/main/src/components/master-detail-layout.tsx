import type { ReactNode } from "react";

export function MasterDetailLayout({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <div className="flex h-[calc(100svh-theme(spacing.14)-theme(spacing.10))]">
      <div className="w-80 shrink-0 overflow-auto border-r">{list}</div>
      <div className="flex-1 overflow-auto">{detail}</div>
    </div>
  );
}
