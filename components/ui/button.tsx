import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white hover:bg-violet-500 active:scale-95 shadow-lg shadow-violet-900/30",
        ghost:
          "text-white/50 hover:text-white hover:bg-white/5 active:scale-95",
        outline:
          "border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 active:scale-95",
        destructive:
          "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50 active:scale-95",
        glass:
          "bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-white/10 hover:text-white active:scale-95",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "w-8 h-8",
        "icon-sm": "w-7 h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
