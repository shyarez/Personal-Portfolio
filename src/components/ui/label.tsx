import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("font-mono text-[11px] uppercase tracking-[0.2em] text-muted", className)}
      {...props}
    />
  );
}
export { Label };
