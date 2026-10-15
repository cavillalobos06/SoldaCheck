import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centers a card vertically and horizontally under the header, on any screen size. */
export function CenteredCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem-3rem)] w-full items-center justify-center px-0 py-6">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lift sm:p-10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Buttons stack full-width on mobile and sit side by side from sm up. */
export function CardActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:flex-1">{children}</div>;
}
