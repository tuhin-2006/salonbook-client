import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E] active:bg-[#1f2d24]",
        destructive:
          "bg-[#8c2e2e] text-[#F5F1E8] hover:bg-[#732424]",
        outline:
          "border border-[#302821]/30 bg-transparent text-[#26372D] hover:bg-[#26372D] hover:text-[#F5F1E8]",
        secondary:
          "bg-[#EAE3D6] text-[#26372D] hover:bg-[#ded5c5]",
        ghost:
          "text-[#26372D] hover:bg-[#EAE3D6]/60",
        link:
          "text-[#26372D] underline underline-offset-8 hover:text-[#B8755B] tracking-wider normal-case font-normal",
        terracotta:
          "bg-[#B8755B] text-[#F5F1E8] hover:bg-[#a3644d]",
        olive:
          "bg-[#343D2E] text-[#F5F1E8] hover:bg-[#26372D]",
        luxury:
          "bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]",
        gradient:
          "bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-12 px-8 text-xs font-semibold tracking-[0.2em]",
        icon: "h-10 w-10",
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
