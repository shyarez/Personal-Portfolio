import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-white/10 bg-white/[0.04] px-4 text-base text-foreground placeholder:text-muted/60 transition-colors focus-visible:border-aura focus-visible:outline-none focus-visible:bg-white/[0.07] disabled:opacity-50 aria-[invalid=true]:border-momo md:text-sm",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
