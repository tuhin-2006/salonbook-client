import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 rounded-xl",
  {
    variants: {
      variant: {
        default:
          "bg-[#3B1F2B] text-[#FAF7F2] hover:bg-[#4A2035] active:scale-[0.99] shadow-sm",
        destructive:
          "bg-[#8c2e2e] text-white hover:bg-[#732424]",
        outline:
          "border border-[#3B1F2B]/30 bg-transparent text-[#3B1F2B] hover:bg-[#3B1F2B] hover:text-[#FAF7F2]",
        secondary:
          "bg-[#F5EFEB] text-[#3B1F2B] hover:bg-[#ECE3DA] border border-[#E8E2D8]",
        ghost:
          "text-[#3B1F2B] hover:bg-[#F5EFEB]",
        link:
          "text-[#3B1F2B] underline underline-offset-8 hover:text-[#C5A880]",
        gold:
          "bg-[#C5A880] text-[#231C1E] hover:bg-[#b8996f] shadow-sm font-bold",
        terracotta:
          "bg-[#B8755B] text-white hover:bg-[#a6634b]",
        gradient:
          "bg-[#3B1F2B] text-[#FAF7F2] hover:bg-[#4A2035]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-12 px-7 text-xs font-bold",
        icon: "h-10 w-10 p-0",
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
