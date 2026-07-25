import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        // Matches the public site's own glass-theme CTA (.nature-page
        // .btn-primary in globals.css): translucent white, not a brand fill —
        // the site deliberately drops marmalade over photo backdrops.
        default:
          "border border-white/30 bg-white/16 text-white shadow-[0_14px_32px_-16px_rgba(0,0,0,.6)] backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/27",
        secondary:
          "border border-white/15 bg-white/10 text-secondary-foreground backdrop-blur-md hover:bg-white/20",
        outline:
          "border border-input bg-transparent hover:border-white/40 hover:bg-white/10",
        ghost: "hover:bg-white/10",
        destructive: "bg-destructive text-white hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
