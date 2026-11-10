import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-36 w-full resize-y rounded-xl border-2 border-white/10 bg-white/[0.04] px-4 py-3 text-base text-foreground placeholder:text-muted/60 transition-colors focus-visible:border-aura focus-visible:outline-none focus-visible:bg-white/[0.07] disabled:opacity-50 aria-[invalid=true]:border-momo md:text-sm",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
export { Textarea };
