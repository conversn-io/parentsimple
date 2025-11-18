import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  className?: string;
  children: ReactNode;
}

/**
 * Shared max-width container to avoid the recurring "narrow column" bug.
 * Ensures every section gets max-width, centered layout, and full available width.
 */
export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = "PageContainer";

