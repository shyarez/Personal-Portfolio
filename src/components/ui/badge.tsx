import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/5 text-foreground",
        momo: "border-momo/40 bg-momo/15 text-momo-soft",
        aura: "border-aura/40 bg-aura/10 text-aura",
        volt: "border-volt/40 bg-volt/10 text-volt",
        ink: "border-ink/20 bg-ink/5 text-ink",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
