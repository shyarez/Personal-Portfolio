import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-momo text-white shadow-[0_0_0_2px_var(--ink),4px_4px_0_0_var(--volt)] hover:-translate-y-0.5 hover:shadow-[0_0_0_2px_var(--ink),6px_6px_0_0_var(--volt)] active:translate-y-0",
        outline:
          "border-2 border-white/20 bg-white/5 text-foreground backdrop-blur hover:border-aura hover:text-aura",
        ink: "bg-ink text-paper shadow-[4px_4px_0_0_var(--momo)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--momo)]",
        ghost: "text-foreground hover:bg-white/5",
        secondary: "bg-white/10 text-foreground hover:bg-white/15",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
