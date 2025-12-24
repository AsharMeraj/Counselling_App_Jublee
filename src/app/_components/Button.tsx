import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../_utils/cn/cn"; // OR add your own class merge util

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className="relative group overflow-hidden px-8 py-3 uppercase w-full  rounded-full font-bold text-white text-lg tracking-tight shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:scale-95"
          style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
